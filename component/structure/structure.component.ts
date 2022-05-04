import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogAlertComponent } from "@component/dialog-alert/dialog-alert.component";
import { emptyUrl } from "@function/empty-url.function";
import { markAllAsDirty } from "@function/mark-all-as-dirty";
import { DataDefinitionToolService } from "@service/data-definition/data-definition-tool.service";
import { SessionStorageService } from "@service/storage/session-storage.service";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Location } from '@angular/common';
import { map, startWith } from "rxjs/operators";
import { Display } from "@class/display";

@Component({
  selector: 'core-show',
  template: '',
})
export abstract class StructureComponent implements OnInit {
  /**
   * Elementos en comun para los componentes estructurales
   */
   control!: AbstractControl
   protected subscriptions = new Subscription() //suscripciones en el ts
   readonly entityName!: string; //Nombre de la entidad principal
   
   display$:BehaviorSubject<Display> = new BehaviorSubject(new Display)
   /**
    * Se define como BehaviorSubject para facilitar la definicion de metodos 
    * avanzados, por ejemplo reload, clear, restart, etc.
    */

   optField: FormControl = new FormControl(null)
   /**
    * field de opciones para disparar eventos
    * Los eventos se definen en switchOptField
    */

   loadParams$!: Observable<any> //carga de parametros
   loadDisplay$!: Observable<any> //carga de display
   loadStorage$!: Observable<any>
   params?: { [x: string]: any } //parametros del componente
   storageValues: any = null
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

  abstract loadDisplay(): void;
  abstract persist(): Observable<any>;
  abstract initDisplay(): void;

  ngOnInit() {
    
    this.loadParams(); 
    /**
     * Al cambiar los parametros se carga el storage, en el template, ejecutar
     * antes de inicializarse el storage
     */

    this.loadStorage(); 
    /**
     * Se carga el storage con los valores del formulario indicando la url con 
     * parametros
     */

    this.loadOptField();

    this.loadDisplay(); 
    /**
     * Se define el display aparte para poder asignar valores directamente al 
     * display, por ejemplo en las funciones clear y reset
     */
  }

  
  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.control.valid) {
      this.cancelSubmit();
    } else {
      this.submit();
    }
  }

  cancelSubmit(){
    markAllAsDirty(this.control);
    //logValidationErrors(this.control);
    this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message: "El formulario posee errores."}
    });
    this.isSubmitted = false;
  }

  submit(){
    var s = this.persist().subscribe({
      next: response => {
        this.response = response
        this.submitted()        
      },
      error: error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
        this.isSubmitted = false;
      }
    });
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
    this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

  serverData() { return this.control.value }

  reset(): void{
    //this.storage.removeItemsPrefix(emptyUrl(this.router.url));
    this.display$.next(this.display$.value);
  }
  
  loadOptField(){
    var s = this.optField.valueChanges.subscribe ({
      next: value => this.switchOptField(value),
      error: error =>  this.snackBar.open(JSON.stringify(error), "X") 
    });
    this.subscriptions.add(s);
  }

  loadParams(){
    this.loadParams$ = this.route.queryParams.pipe(
      map(
        queryParams => { 
          console.log(queryParams)
          // this.storageValues = this.storage.getItem(this.router.url)
          //this.storage.removeItemsPrefix(emptyUrl(this.router.url))
          this.initParams(queryParams);
          this.initDisplay();
          return true;
        },
      ),
    )
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

  initParams(params: { [x: string]: any }){ this.params = params; }

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
    this.loadStorage$ = this.control.valueChanges.pipe(
      startWith(this.storage.getItem(this.router.url)),
      map(
        storageValues => {
          console.log(storageValues)
          this.storage.setItem(this.router.url, storageValues)
          return true;
        }
    ))
  }

  abstract getStorageValues(): any;
    
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