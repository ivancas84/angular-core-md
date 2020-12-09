import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { map, switchMap } from 'rxjs/operators';
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

@Component({
  selector: 'core-admin',
  template: '',
})
export abstract class AdminComponent implements OnInit, AfterViewInit {
/**
 * Formulario de administracion (FormGroup) formado por fieldsets (FormGroups)
 */

  adminForm: FormGroup = this.fb.group({}); //formulario principal
  /**
   * Se asignaran dinamicamente los formgroups correspondientes a fieldsets
   */

  readonly entityName: string; //entidad principal
  display$:BehaviorSubject<any> = new BehaviorSubject(null); //parametros de consulta
  /**
   * se define como BehaviorSubject para facilitar la definicion de funciones avanzadas, por ejemplo reload, clear, restart, etc.
   */
  data: any; //datos principales

  isDeletable: boolean = false; //Flag para habilitar/deshabilitar boton eliminar
  isSubmitted: boolean = false; //Flag para habilitar/deshabilitar boton aceptar

  params: any; //parametros
  loadParams$: Observable<any>; //carga de parametros
  loadDisplay$: Observable<any>; //carga de display
  protected subscriptions = new Subscription(); //suscripciones en el ts

  constructor(
    protected fb: FormBuilder, 
    protected route: ActivatedRoute, 
    protected router: Router, 
    protected location: Location, 
    protected dd: DataDefinitionService, 
    protected storage: SessionStorageService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
  ) {}
  
  ngAfterViewInit(): void {
    this.storage.removeItemsPrefix(emptyUrl(this.router.url));
    /**
     * Si no se incluye, nunca se limpia el formulario 
     * Si se asignan otros parametros a la url quedan todas las alternativas de una misma interface
     * en la cache, pudiendo resultar confuso para el que lo utiliza
     * de esta forma cada vez que se asigna a una interfaz inicialmente se borra la cache
     * si el usuario realiza una modificacion se carga nuevamente la cache
     * al rutear a una interface diferente y volver se carga el valor de la cache y nuevamente se borra
     * logrando el comportamiento deseado
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
     * Con esto me aseguro que se suscribe inicialmente y no ensucio el HTML
     */
    var s = this.adminForm.valueChanges.subscribe (
      formValues => { this.storage.setItem(this.router.url, formValues); },
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
          var params = this.initParams(queryParams);
          this.initDisplay(params)
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
     * Se define como observable y se suscribe en el template
     * con esto me aseguro de que me suscribo luego de inicializados los parametros
     * Si me suscribo directamente en el template, se suscribe dos veces, uno en null y otro con el valor del parametro
     */
    this.loadDisplay$ =  this.display$.pipe(
      switchMap(
        () => {
          return this.initData();
        }
      ),
      map(
        data => {
          this.data = data;
          return true;
        }
      )
    )
  }

  initParams(params: any){ return params; }

  initDisplay(params){ this.display$.next(params);  }

  initData(): Observable<any> {
    return of({}).pipe(
      switchMap(() => {
        if(isEmptyObject(this.display$.value)) return of (null);
        else return this.dd.unique(this.entityName, this.display$.value)
      }),
      map(
        data => {
          if(!isEmptyObject(data)) return data;
          return fastClone(this.display$.value)
          /**
           * Se retorna un clone para posibilitar el cambio y el uso de ngOnChanges si se requiere
           */
        }
      )
    );
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
    return this.dd.post("persist", this.entityName, this.serverData())
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