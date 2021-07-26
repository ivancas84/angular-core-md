import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { emptyUrl } from '../../function/empty-url.function';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { isEmptyObject } from '../../function/is-empty-object.function';
import { OnInit, AfterViewInit, Component } from '@angular/core';
import { markAllAsDirty } from '../../function/mark-all-as-dirty';
import { logValidationErrors } from '../../function/log-validation-errors';
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fastClone } from '@function/fast-clone';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { DataDefinitionFkObjService } from '@service/data-definition/data-definition-fk-obj.service';
import { DataDefinitionUmObjService } from '@service/data-definition/data-definition-um-obj.service';
import { FormGroupExt } from '@class/reactive-form-ext';

@Component({
  selector: 'core-admin',
  template: '',
})
export abstract class AdminComponent implements OnInit, AfterViewInit { //2
/**
 * Formulario de administracion (FormGroup) formado por fieldsets (FormGroups)
 * En el caso de que se utilice el template general formado por componentes dinamicos deberan definirse los siguientes atributos adicionales:
 *   title: string; Titulo del fieldset dinamico
 *   fieldsViewOptions: FieldViewOptions[] Configuracion de campos
 */

  adminForm: FormGroup; //formulario principal
  /**
   * Se asignaran dinamicamente los formGroups correspondientes a fieldsets
   */

  readonly entityName: string; //entidad principal

  display$:BehaviorSubject<any> = new BehaviorSubject(null); //parametros de consulta
  /**
   * se define como BehaviorSubject para facilitar la definicion de funciones avanzadas, por ejemplo reload, clear, restart, etc.
   */
  
  isSubmitted: boolean = false; //Flag para habilitar/deshabilitar boton aceptar

  params: { [x: string]: any; } //parametros del componente
  
  loadParams$: Observable<any>; //carga de parametros
  
  loadDisplay$: Observable<any>; //carga de display
  
  protected subscriptions = new Subscription(); //suscripciones en el ts
  
  persistApi: string = "persist_rel";
  
  queryApi: string = "unique_rel";

  defaultValues: {[key:string]: any} = {};

  formValues = this.storage.getItem(this.router.url);

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
    protected relUm: DataDefinitionUmObjService
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

    this.loadStorage();
    this.loadParams();  
    this.loadDisplay();
  }

  loadStorage() {
    /**
     * Me suscribo directamente en el ts
     * @todo es posible pasarlo al html?
     */
    var s = this.adminForm.valueChanges.subscribe (
      formValues => {
        console.log(this.router.url)
        this.storage.setItem(this.router.url, formValues); },
      error => { 
        this.snackBar.open(JSON.stringify(error), "X"); 
      }
    );
    this.subscriptions.add(s);
  }

  loadParams(){
    /**
     * No realizar la suscripcion en el template (cambia el Lifecycle)! 
     * Puede generar errores "ExpressionChanged"
     */
    this.loadParams$ = this.route.queryParams.pipe(
      map(
        queryParams => { 
          this.initParams(queryParams);
          this.initDisplay()
        },
        error => { 
          this.snackBar.open(JSON.stringify(error), "X"); 
        }
      ), 
      map(
        () => {return true;}
      )
    )
  }

  loadDisplay(){
    /**
     * A diferencia de los componentes de visualizacion o similares
     * Se define un load independiente para el display 
     * debido a que se puede reasignar directamente el display para reinicializar
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
          this.adminForm.patchValue(data);
          return true;
        }
      )
    )
  }

  initParams(params: any){ this.params = params; }

  initDisplay(){ this.display$.next(this.params);  }

  initData(): Observable<any> {
    return of({}).pipe(
      switchMap(() => {
        if(this.formValues) return of(this.formValues);
        if(isEmptyObject(this.display$.value)) return of (this.defaultValues);
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
        return this.relFk.uniqueGroup(this.entityName, this.display$.value, this.adminForm).pipe(
        switchMap(
          row => {
            return this.relUm.group(this.entityName, row, this.adminForm)
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

  serverData() {  
    return this.adminForm.get(this.entityName).value;
    //return this.adminForm.value
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }


  
}
