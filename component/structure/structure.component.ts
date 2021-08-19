import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractControlOption } from "@class/reactive-form-config";
import { DialogAlertComponent } from "@component/dialog-alert/dialog-alert.component";
import { emptyUrl } from "@function/empty-url.function";
import { logValidationErrors } from "@function/log-validation-errors";
import { markAllAsDirty } from "@function/mark-all-as-dirty";
import { DataDefinitionToolService } from "@service/data-definition/data-definition-tool.service";
import { SessionStorageService } from "@service/storage/session-storage.service";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Location } from '@angular/common';
import { map } from "rxjs/operators";



@Component({
  selector: 'core-show',
  template: '',
})
export abstract class StructureComponent implements OnInit {
  /**
   * Elementos en comun para los componentes estructurales
   */
   form: AbstractControl
   protected subscriptions = new Subscription() //suscripciones en el ts
   readonly entityName: string; //Nombre de la entidad principal
   display$:BehaviorSubject<any> = new BehaviorSubject(null) //parametros de consulta
   /**
   * se define como BehaviorSubject para facilitar la definicion de funciones avanzadas, por ejemplo reload, clear, restart, etc.
   */
   optField: FormControl = new FormControl(null)//field de opciones para disparar eventos
   optFooter: AbstractControlOption[] = [] //opciones de componente
   loadParams$: Observable<any> //carga de parametros
   loadDisplay$: Observable<any> //carga de display
   params: { [x: string]: any } //parametros del componente
   storageValues = this.storage.getItem(this.router.url);
   isSubmitted: boolean = false //Flag para habilitar/deshabilitar boton aceptar
   response: any //respuesta de procesamiento

   constructor(
    protected dialog: MatDialog,
    protected storage: SessionStorageService,
    protected dd: DataDefinitionToolService, 
    protected snackBar: MatSnackBar,
    protected router: Router, 
    protected location: Location, 
    protected route: ActivatedRoute, 
  ) { }

  abstract loadDisplay();
  abstract persist(): Observable<any>;
  abstract initDisplay();

  ngOnInit() {
    this.loadParams();  
    this.loadStorage();
    this.loadOptField();
    this.loadDisplay(); 
    /**
     * Se define el display aparte para poder asignar valores directamente al display, por ejemplo en las funciones clear y reset
     */
  }

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

  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.form.valid) {
      this.cancelSubmit();
    } else {
      this.submit();
    }
  }

  cancelSubmit(){
    markAllAsDirty(this.form);
    logValidationErrors(this.form);
    this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message: "El formulario posee errores."}
    });
    this.isSubmitted = false;
  }

  submit(){
    var s = this.persist().subscribe(
      response => {
        this.response = response
        this.submitted()        
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

  submitted(){
    this.snackBar.open("Registro realizado", "X");
    this.removeStorage();
    this.reload();
  }

  removeStorage(){
    this.storage.removeItemsContains(".");
    this.storage.removeItemsPersisted(this.response["detail"]);
    this.storage.removeItemsPrefix(emptyUrl(this.router.url));
  }

  reload(){
    /**
     * Recargar una vez persistido
     */
    let route = emptyUrl(this.router.url) + "?id="+this.response["id"];
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

  serverData() { return this.form.value }

  
  reset(): void{
    //this.storage.removeItemsPrefix(emptyUrl(this.router.url));
    this.display$.next(this.display$.value);
  }
  
  loadOptField(){
    var s = this.optField.valueChanges.subscribe (
      value => this.switchOptField(value),
      error =>  this.snackBar.open(JSON.stringify(error), "X") 
    );
    this.subscriptions.add(s);
  }

  loadParams(){
    this.loadParams$ = this.route.queryParams.pipe(
      map(
        queryParams => { 
          this.initParams(queryParams);
          this.initDisplay();
          return true;
        },
        error => { 
          this.snackBar.open(JSON.stringify(error), "X"); 
        }
      ),
    )
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

  initParams(params: any){ this.params = params; }

  switchOptField(value: any){
    console.log(value);
    switch(value.action){
      case "submit": this.onSubmit(); break;
      case "clear": this.clear(); break;
      case "back": this.back(); break;
      case "reset": this.reset(); break;
    }
  }

  loadStorage() {
    /**
     * Me suscribo directamente en el ts
     * @todo es posible pasarlo al html?
     */
    var s = this.form.valueChanges.subscribe (
      storageValues => {
        this.storage.setItem(this.router.url, storageValues); },
      error => { 
        this.snackBar.open(JSON.stringify(error), "X"); 
      }
    );
    this.subscriptions.add(s);
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

  back() { this.location.back(); }

}