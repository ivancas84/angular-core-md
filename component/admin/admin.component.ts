import { FormGroup, FormBuilder } from '@angular/forms';
import { ReplaySubject, Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { emptyUrl } from '../../function/empty-url.function';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { isEmptyObject } from '../../function/is-empty-object.function';
import { OnInit, AfterViewInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { markAllAsDirty } from '../../function/mark-all-as-dirty';
import { logValidationErrors } from '../../function/log-validation-errors';
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'core-admin',
  template: '',
changeDetection: ChangeDetectionStrategy.OnPush


})
export abstract class AdminComponent implements OnInit, AfterViewInit {
/**
 * Formulario de administracion (FormGroup) formado por fieldsets (FormGroups)
 */

  adminForm: FormGroup = this.fb.group({});
  /**
   * Formulario principal
   * Se asignaran dinamicamente los formgroups correspondientes a fieldsets
   */

  readonly entityName: string;
  /**
   * Entidad principal
   */
  
  data$:ReplaySubject<any> = new ReplaySubject();
  /**
   * Datos principales
   * Se define como ReplaySubject porque puede recibir valores nuevos que deben ser asignados con metodo .next
   * No se utiliza BehaviorSubject para evitar procesamiento adicional con el valor null
   * null es un dato valido para data$ significa que no esta definido por lo que los subcomponentes inicializaran como si estuviera vacio
   * Se podria usar BehaviorSubject y manejar diferentes alternativas para indicar si esta o no definido, por ejemplo null o false
   */

  isDeletable: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton eliminar
   */

  isSubmitted: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton aceptar
   */

  protected subscriptions = new Subscription();
   
  params: any;

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
     * Puede resultar confuso cuando se asignan otros parametros a la url
     */
  }

  ngOnInit() {
    this.storageValueChanges();
    this.initData();   
  }

  storageValueChanges() {
    var s = this.adminForm.valueChanges.subscribe (
      formValues => { this.storage.setItem(this.router.url, formValues); },
      error => { 
        this.snackBar.open(JSON.stringify(error), "X"); 
      }
    );
    this.subscriptions.add(s);
  }

  initData(){
    /**
     * No realizar la suscripcion en el template (cambia el Lifecycle)! 
     * Puede generar errores "ExpressionChanged"
     */
    var s = this.route.queryParams.subscribe(
      params => { 
        this.setParams(params);
        this.setData()
      },
      error => { 
        this.snackBar.open(JSON.stringify(error), "X"); 
      }
    )
    this.subscriptions.add(s);
  }

  setParams(params: any){ this.params = params; }

  setData(): void {
    if(isEmptyObject(this.params)) {
      this.data$.next(null);
      return;
    } 

    this.dd.uniqueOrNull(this.entityName, this.params).pipe(first()).subscribe(
      response => {
        if (response) this.data$.next(response);
        else this.data$.next(this.params);
      },
      error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
      }
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
    else this.setData()
    
  }

  reset(): void{
    this.setData()
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
      markAllAsDirty(this.adminForm);
      logValidationErrors(this.adminForm);
      const dialogRef = this.dialog.open(DialogAlertComponent, {
        data: {title: "Error", message: "El formulario posee errores."}
      });
      this.isSubmitted = false;

    } else {
      var s = this.persist().pipe(first()).subscribe(
        response => {
          this.storage.removeItemsContains(".");
          this.storage.removeItemsPersisted(response["detail"]);
          this.storage.removeItemsPrefix(emptyUrl(this.router.url));
          this.reload(response);
        },
        error => { 
          console.log(error);
          this.dialog.open(DialogAlertComponent, {
            data: {title: "Error", message: error.error}
          });
          this.isSubmitted = false;
    
        }
      );
      this.subscriptions.add(s);
    }
  }

  reload(response){
    /**
     * Recargar una vez persistido
     */
    let route = emptyUrl(this.router.url) + "?id="+response["id"];
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.setData();
    this.snackBar.open("Registro realizado", "X");
    this.isSubmitted = false;
  }

  serverData() {  
    return this.adminForm.get(this.entityName).value;
    //return this.adminForm.value
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }
}