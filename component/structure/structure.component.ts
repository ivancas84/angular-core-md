import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { isEmptyObject } from "@function/is-empty-object.function";
import { of } from "rxjs";

declare function copyFormatted(html: any): any;
declare function printHtml(html: any): any;

@Component({
  selector: 'core-show',
  template: '',
})
export abstract class StructureComponent implements OnInit {
  /**
   * Elementos en comun para los componentes estructurales
   */
   control!: AbstractControl
   /**
    * Datos principales
    * 
    * Todos los datos se recomienda almacenarlos en un control raiz, para fa-
    * cilitar la implementacion del storage.
    */
   protected subscriptions = new Subscription() //suscripciones en el ts
   
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
   params: { [x: string]: any } = {} //parametros del componente
   storageValues: any = null
   isSubmitted: boolean = false //Flag para habilitar/deshabilitar boton aceptar
   response: any //respuesta de procesamiento
   @ViewChild("mainContent") content!: ElementRef; //contenido para copiar o imprimir

   constructor(
    protected dd: DataDefinitionToolService,
    protected storage: SessionStorageService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected router: Router, 
    protected route: ActivatedRoute, 
    protected location: Location, 
  ) { }

  abstract loadDisplay(): void;
  abstract initDisplay(): void;

  initData(): Observable<any> {
    /**
     * Inicializacion de datos.
     * 
     * Método habitual donde se definen las consultas a la base de datos.
     */
    throw new Error("Method not implemented.");
  }

  persist(): Observable<any> {
    /**
     * Persistencia de datos.
     * 
     * Para aquellos componentes que requieran ser perssistidos. Debe redefi-
     * nirse este método.
     */
    throw new Error("Method not implemented.");
  }

  ngOnInit() {
    
    this.loadParams(); 
    /**
     * Al cambiar los parametros se carga el storage, en el template, ejecutar
     * antes de inicializarse el storage
     */

    this.loadStorage(); 
    /**
     * Se carga el storage con los valores del formulario indicando la url con 
     * parametros.
     * Utilizar el storage con precaucion.
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
      if(this.control.pending) this.dialog.open(DialogAlertComponent, {
        data: {title: "Error", message: "El formulario esta procesando, repita el proceso de envío"}
      });
      else this.cancelSubmit();
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
    if (this.response["detail"]) this.storage.removeItemsPersisted(this.response["detail"]);
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
    this.storage.removeItemsPrefix(emptyUrl(this.router.url))
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
    /**
     * @description
     * Es comun ir a otra interfaz y volver, debiendo utilizar valo-
     * res del storage. No se recomienda eliminar el storage al car-
     * gar los parametros.
     */
    this.loadParams$ = this.route.queryParams.pipe(
      map(
        queryParams => { 
          // this.storageValues = this.storage.getItem(this.router.url)
          //this.storage.removeItemsPrefix(emptyUrl(this.router.url))
          this.initParams(queryParams);
          this.initDisplay();
          return true;
        },
      ),
    )
  }

  initStorage(): Observable<any>{
    /**
     * Comportamiento habitual de inicializacion del storage
     */
    this.storageValues = this.storage.getItem(this.router.url)
    this.storage.removeItemsPrefix(emptyUrl(this.router.url))
    if(!isEmptyObject(this.storageValues)) return of(this.storageValues)
    else return this.initData();
  }
  

  ngOnDestroy () { this.subscriptions.unsubscribe() }

  initParams(params: { [x: string]: any }){ this.params = params; }

  switchOptField(data: { action: string; [x: string]: any; }): void{
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
      case "copy_content": this.copyContent(); break;
      case "print_content": this.printContent(); break;
      default: console.log("No implementado: " + data.action);
      
    }
  }

  
  loadStorage() {
    this.loadStorage$ = this.control.valueChanges.pipe(
      startWith(this.storage.getItem(this.router.url)),
      map(
        storageValues => {
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
 
    this.storage.removeItemsPrefix(emptyUrl(this.router.url));
    let route = emptyUrl(this.router.url);
    if(route != this.router.url) this.router.navigateByUrl('/' + route);
    else this.display$.next(this.display$.value); 
  }

  back() { this.location.back(); }


  copyContent(): void {
    if(this.content) {
      copyFormatted(this.content.nativeElement.innerHTML);
    }
  }

  printContent(): void {
    if(this.content) {
      printHtml(this.content.nativeElement.innerHTML);
    }
  }
}