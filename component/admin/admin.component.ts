import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionFkObjService } from '@service/data-definition/data-definition-fk-obj.service';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { DataDefinitionUmObjService } from '@service/data-definition/data-definition-um-obj.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { emptyUrl } from '@function/empty-url.function';
import { map, switchMap, tap } from 'rxjs/operators';
import { fastClone } from '@function/fast-clone';
import { Location } from '@angular/common';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { isEmptyObject } from '@function/is-empty-object.function';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsDirty } from '@function/mark-all-as-dirty';
import { DataDefinitionRelLabelService } from '@service/data-definition/data-definition-rel-label.service';
import { FormConfigService } from '@service/form-config/form-config.service';
import { FormConfig, FormControlConfig, FormControlOption, FormControlsConfig, FormStructureConfig } from '@class/reactive-form-config';
import { ComponentOptions } from '@class/component-options';
import { EventButtonFieldViewOptions, EventIconFieldViewOptions, RouteIconFieldViewOptions } from '@class/field-type-options';


@Component({
  selector: 'core-admin',
  template: './admin.component.html',
})
export abstract class AdminComponent implements OnInit{
  adminForm: FormGroup
  configForm: FormStructureConfig
  configComponent: { [x: string]: ComponentOptions }

  optField: FormControl = new FormControl(null)//field de opciones para disparar eventos
  optComponent: FormControlOption[] = [ //opciones de componente
    new FormControlOption({
      config: new FormControlConfig({ 
        type: new EventButtonFieldViewOptions({
          text: "Aceptar", //texto del boton
          action: "submit", //accion del evento a realizar
          color: "primary",
          fieldEvent: this.optField
        }) 
      }),
    }),

    new FormControlOption({
      config: new FormControlConfig({ 
        type: new EventIconFieldViewOptions({
          icon: "add", //texto del boton
          action: "clear", //accion del evento a realizar
          color: "accent",
          fieldEvent: this.optField
        }) 
      }),
    }),

    new FormControlOption({
      config: new FormControlConfig({ 
        type: new EventIconFieldViewOptions({
          icon: "arrow_back", //texto del boton
          action: "back", //accion del evento a realizar
          color: "accent",
        }) 
      }),
      field: this.optField
    }),
  ]; 
  
  readonly entityName: string //entidad principal
  title: string //titulo principal
  isDeletable: boolean = false //Flag para habilitar/deshabilitar boton eliminar
  @Output() event: EventEmitter<any> = new EventEmitter() //eventos
  options: any[] = null //opciones (si es null no se visualiza)
  display$:BehaviorSubject<any> = new BehaviorSubject(null) //parametros de consulta
  /**
   * se define como BehaviorSubject para facilitar la definicion de funciones avanzadas, por ejemplo reload, clear, restart, etc.
   */
  
  isSubmitted: boolean = false //Flag para habilitar/deshabilitar boton aceptar
  params: { [x: string]: any } //parametros del componente
  loadParams$: Observable<any> //carga de parametros
  loadDisplay$: Observable<any> //carga de display
  protected subscriptions = new Subscription() //suscripciones en el ts
  persistApi: string = "persist_rel"
  queryApi: string = "unique_rel"
  defaultValues: {[key:string]: any} = {}
  formValues = this.storage.getItem(this.router.url);
  inputSearchGo: boolean = true; //flag para activar / desactivar componente inputSearchGo

  constructor(
    protected fb: FormBuilder, 
    protected route: ActivatedRoute, 
    protected router: Router, 
    protected location: Location, 
    protected dd: DataDefinitionToolService, 
    protected validators: ValidatorsService,
    protected storage: SessionStorageService, 
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected relFk: DataDefinitionFkObjService,
    protected relUm: DataDefinitionUmObjService,
    protected ddrl: DataDefinitionRelLabelService, 
    protected fc: FormConfigService
  ) { }
  

  ngAfterViewInit(): void {
    this.storage.removeItemsPrefix(emptyUrl(this.router.url));
    /**
     * Si no se incluye, nunca se limpia el formulario. 
     * Si se asignan otros parametros a la url quedan todas las alternativas de una misma interface en la cache, pudiendo resultar confuso para el que lo utiliza
     * De esta forma cada vez que se asigna a una interfaz inicialmente se borra la cache
     * Si el usuario realiza una modificacion se carga nuevamente la cache
     * Al rutear a una interface diferente y volver se carga el valor de la cache y nuevamente se borra logrando el comportamiento deseado
     */
  }

  ngOnInit() {
    this.loadParams();  
    this.loadStorage();
    this.loadDisplay(); 
    /**
     * @test Se define el display a parte para poder asignar valores directamente al display, por ejemplo en las funciones clear y reset
     */
    this.loadOptField();
  }

  loadOptField(){
    var s = this.optField.valueChanges.subscribe (
      value => this.switchOptField(value),
      error =>  this.snackBar.open(JSON.stringify(error), "X") 
    );
    this.subscriptions.add(s);
  }

  switchOptField(value: any){
    switch(value.action){
      case "submit": this.onSubmit(); break;
      case "clear": this.clear(); break;
      case "back": this.back(); break;
      case "reset": this.reset(); break;
      case "delete": this.delete(); break;
    }
  }

  loadStorage() {
    /**
     * Me suscribo directamente en el ts
     * @todo es posible pasarlo al html?
     */
    var s = this.adminForm.valueChanges.subscribe (
      formValues => {
        this.storage.setItem(this.router.url, formValues); },
      error => { 
        this.snackBar.open(JSON.stringify(error), "X"); 
      }
    );
    this.subscriptions.add(s);
  }

  loadParams(){
    this.loadParams$ = this.route.queryParams.pipe(
      map(
        queryParams => { 
          this.initParams(queryParams);
          this.initDisplay();
        },
        error => { 
          this.snackBar.open(JSON.stringify(error), "X"); 
        }
      ),
      map(
        () => {
          return true;
        }
      )
    )
  }

  
  loadDisplay(){
    /**
     * Se define un load independiente para el display, es util para reasignar valores directamente al display y reinicializar
     * por ejemplo al limpiar o resetear el formulario
     */
    this.loadDisplay$ = this.display$.pipe(
      switchMap(
        () => {
          return this.initData();
        }
      ),
      map(
        data => {
          this.fc.initValue(this.configForm, this.adminForm, data)
          if(this.formValues) this.adminForm.patchValue(data);
          return true;
        }
      ),
    )
  }

  initParams(params: any){ this.params = params; }

  initDisplay(){ this.display$.next(this.params);  }

  initData(): Observable<any> {
    return of({}).pipe(
      switchMap(() => {
        if(isEmptyObject(this.display$.value)) return of (this.fc.defaultValues(this.configForm));
        else return this.queryData();
      }),
      map(
        data => {
          if(!isEmptyObject(data)) return data;
          return this.initDataFromDisplay();
          /**
           * Se retorna un clone para posibilitar el cambio y el uso de ngOnChanges si se requiere
           */
        }
      )
    );
  }

  initDataFromDisplay(){
    return fastClone(this.display$.value)
  }

  queryData(): Observable<any> {
    switch(this.queryApi){
      case "unique_rel_um": case "unique_rel":  
        return this.relFk.uniqueGroup(this.entityName, this.display$.value, this.configForm.controls).pipe(
        switchMap(
          row => {
            return this.relUm.group(this.entityName, row, this.configForm.controls)
          }
        ),
      )
      case "unique": return this.dd.unique(this.entityName, this.display$.value) 
      default: return this.dd.post(this.queryApi, this.entityName, this.display$.value);
    }
  }

  back() { this.location.back(); }

  delete() { 
    this.snackBar.open("No implementado", "X"); 
  }

  clear(): void {
    /**
     * Limpiar url y reinicializa datos
     * si la ruta es diferente, se reasignaran los parametros de la url y se repetira el proceso de inicializacion
     * si la ruta es la misma, se limpia el storage y se asignan parametros en null
     */
    let route = emptyUrl(this.router.url);
    if(route != this.router.url) this.router.navigateByUrl('/' + route);
    else this.display$.next(this.display$.value);
    
  }

  reset(): void{
    //this.storage.removeItemsPrefix(emptyUrl(this.router.url));
    this.display$.next(this.display$.value);
  }
  
  persist(): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd._post(this.persistApi, this.entityName, this.serverData())
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.adminForm.valid) {
      this.cancelSubmit();
    } else {
      this.submit();
    }
  }

  cancelSubmit(){
    markAllAsDirty(this.adminForm);
    logValidationErrors(this.adminForm);
    this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message: "El formulario posee errores."}
    });
    this.isSubmitted = false;
  }

  submit(){
    var s = this.persist().subscribe(
      response => {
        this.submitted(response)        
      },
      error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
        this.isSubmitted = false;
      }
    );
    this.subscriptions.add(s);
  }

  submitted(response){
    this.snackBar.open("Registro realizado", "X");
    this.removeStorage(response);
    this.reload(response);
  }
  
  removeStorage(response){
    this.storage.removeItemsContains(".");
    this.storage.removeItemsPersisted(response["detail"]);
    this.storage.removeItemsPrefix(emptyUrl(this.router.url));
  }

  reload(response){
    /**
     * Recargar una vez persistido
     */
    let route = emptyUrl(this.router.url) + "?id="+response["id"];
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

  serverData() { return this.adminForm.value }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

  switchAction($event:any){ 
    /**
     * Acciones de opciones
     * Sobescribir si se necesita utilizar eventos
     * Utilizar $event.action para la accion a ejecutar (corresponde a opt.action)
     * Utilizar $event.data para los datos a utilizar (corresponde a row)
     */  
    switch($event.action){
      case "delete":
        this.delete()
      break;
      default:
        throw new Error("Not Implemented");
    }   
  }

  emitEvent($event){
    switch($event.action){
      default:
        this.event.emit($event);
    }
  }
}
