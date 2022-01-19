import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogAlertComponent } from "@component/dialog-alert/dialog-alert.component";
import { emptyUrl } from "@function/empty-url.function";
import { logValidationErrors } from "@function/log-validation-errors";
import { markAllAsDirty } from "@function/mark-all-as-dirty";
import { DataDefinitionToolService } from "@service/data-definition/data-definition-tool.service";
import { SessionStorageService } from "@service/storage/session-storage.service";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Location } from '@angular/common';
import { map, startWith } from "rxjs/operators";
import { AbstractControlViewOption } from "@component/abstract-control-view/abstract-control-view.component";



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
   optField: FormControl = new FormControl(null)
   /**
    * field de opciones para disparar eventos
    * Los eventos se definenen en switchOptField
    */

   optFooter: AbstractControlViewOption[] = [] //opciones de componente
   /**
    { //boton aceptar
      config: new EventButtonConfig({
        text: "Aceptar", 
        action: "submit",
        color: "primary",
        fieldEvent: this.optField
      }),
    },
    { //boton agregar
      config: new EventIconConfig({
        icon: "add", //texto del boton
        action: "add", //accion del evento a realizar
        color: "primary",
        fieldEvent: this.config.optField
      })
    },
    { //boton volver
      config: new EventIconConfig({
        icon: "arrow_back", //texto del boton
        action: "back", //accion del evento a realizar
        color: "accent",
        fieldEvent: this.optField
      })
    },
    { //boton reset
      config: new EventIconConfig({
        icon: "autorenew", //texto del boton
        action: "reset", //accion del evento a realizar
        color: "accent",
        fieldEvent: this.optField
      })
    },
    */
   loadParams$: Observable<any> //carga de parametros
   loadDisplay$: Observable<any> //carga de display
   loadStorage$: Observable<any>
   params: { [x: string]: any } //parametros del componente
   storageValues: any = null
  //  storageValues = this.storage.getItem(this.router.url);
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
    /**
     * al cambiar los parametros se carga el storage, 
     * debe ir antes de inicializarse el storage
     * @todo no es correcto pensar que se ejecuta loadParams antes de loadStorage
     */

    this.loadStorage(); 
    /**
     * se carga el storage con los valores del formulario indicando la url con parametros
     */

    this.loadOptField();

    this.loadDisplay(); 
    /**
     * Se define el display aparte para poder asignar valores directamente al display, por ejemplo en las funciones clear y reset
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
          // this.storageValues = this.storage.getItem(this.router.url)
          // this.storage.removeItemsPrefix(emptyUrl(this.router.url))
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

  switchOptField(data: { action: string; [x: string]: any; }){
    /**
     * Ejecutar opcion de evento
     * 
     * @param data: Es un objeto cuyos atributos pueden variar dependiendo de 
     * donde se llame, siempre posee el elemento "action" para indicar la ac-
     * cion a ejecutar. Si se llama desde una fila de un array, posee los si-
     * guientes elementos:
     *   "action" Accion a ejecutar.
     *   "control" FormGroup correspondiente a la fila.
     *   "index" Indice de la fila que se esta llamando.  
     *   
     */
    switch(data.action){
      case "submit": this.onSubmit(); break;
      case "clear": this.clear(); break;
      case "back": this.back(); break;
      case "reset": this.reset(); break;
    }
  }

  
  loadStorage() {
    this.loadStorage$ = this.form.valueChanges.pipe(
      startWith(this.getStorageValues()),
      map(
      storageValues => {
        this.storage.setItem(this.router.url, this.getStorageValues())
        return true;
      },
      error => { 
        this.snackBar.open(JSON.stringify(error), "X"); 
      }
    ))


    // var s = this.form.valueChanges.subscribe (
    //   storageValues => {
    //     this.storage.setItem(this.router.url, this.getStorageValues())
    //   },
    //   error => { 
    //     this.snackBar.open(JSON.stringify(error), "X"); 
    //   }
    // );
    // this.subscriptions.add(s);
  }

  abstract getStorageValues();
  
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