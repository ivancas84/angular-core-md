import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Display } from '@class/display';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { DataDefinitionRelFieldsService } from '@service/data-definition/data-definition-rel-fields.service';
import { FormArrayConfig, FormStructureConfig } from '@class/reactive-form-config';
import { FormArray, FormGroup } from '@angular/forms';
import { FormConfigService } from '@service/form-config/form-config.service';
import { TableDynamicOptions } from '@class/table-dynamic-options';
import { ComponentOptions } from '@class/component-options';

@Component({
  selector: 'core-show',
  template: './show.component.html',
})
export abstract class ShowComponent implements OnInit {
  /**
   * Definir un conjunto de datos para visualizacion
   * El componente no define la manera en que se visualizaran los datos (puede ser a traves de una tabla o del componente deseado)
   * El componente define el codigo en comun para obtener un conjunto de datos del servidor y posteriormente visualizarlos
   */

  readonly entityName: string; //Nombre de la entidad principal
  form: FormArray = new FormArray([])
  configForm: FormArrayConfig
  length?: number; //longitud total de los datos a mostrar
  params: { [x: string]: any; } //Parametros del componente
  loadLength: boolean = true; //flag para indicar que se debe consultar longitud
  loadParams$: Observable<any> //carga de parametros
  loadDisplay$: Observable<any> //carga de display
  display$:BehaviorSubject<any> = new BehaviorSubject(null) //parametros de consulta
  /**
   * se define como BehaviorSubject para facilitar la definicion de funciones avanzadas, por ejemplo reload, clear, restart, etc.
   */

  
  load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga
  tableOptions: ComponentOptions = new TableDynamicOptions()

  searchForm: FormGroup
  searchConfig: FormStructureConfig


  constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
    protected storage: SessionStorageService,
    protected ddrf: DataDefinitionRelFieldsService,
    protected fc: FormConfigService
  ) {}


  loadParams(){
    this.loadParams$ = this.route.queryParams.pipe(
      map(
        queryParams => { 
          this.initParams(queryParams);
          this.initDisplay();
          return true;
        },
        error => { 
          console.log(error)
        }
      ),
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
          this.load = false
          return (this.loadLength) ? this.initLength() : of(null)
        }
      ),
      switchMap(
        () => this.initData()
      ),
      map(
        data => {
          if (!this.loadLength) this.length = data.length
          this.fc.initArray(this.configForm, this.form, data)
          return this.load = true
        }
      ),
    )
  }

  ngOnInit(): void {
    this.loadParams()
    this.loadDisplay()
  }

  initParams(params: any){ 
    this.params = params; 
  }

  initDisplay() {
    var display = new Display();
    display.setSize(100);
    display.setParamsByQueryParams(this.params);
    this.display$.next(display)
  }

  initLength(): Observable<any> {
    /**
     * Si no se desea procesar la longitud, retornar of(undefined)
     */
    return this.dd.post("count", this.entityName, this.display$.value).pipe(
      catchError(
        (error) => {
          this.dialog.open(DialogAlertComponent, {
            data: {title: "Error", message: error.error}
          })
         return of(0);
        }
      ),    
      tap(
        count => { this.length = count; }
      )
    );
  }

  initData(): Observable<any>{
    if(this.loadLength && !this.length) return of([]); 
    return this.queryData();
  }

  delete(id){
    /**
     * Importante, utilizar el id
     * En implementaciones previas, se utilizaba el indice y se eliminaba el contenido del array para evitar consultar a la base de datos
     * Pero si se utilizaba ordenamiento de tablas, no se reflejaba el indice correcto al eliminar
     * @todo Reimplementar para evitar acceder al servidor una vez eliminado
     * No es conveniente implementar alguna solucion desde los componentes anidados?
     */
    this.dd._post("delete",this.entityName,[id]).pipe(
      map(
        response => {
          this.storage.removeItemsContains(".");
          this.storage.removeItemsPersisted(response["detail"]);
          this.length--;
          this.display$.next(this.display$.value)
        }
      )
    ).subscribe(
      () => {
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Registro eliminado", message: "Se ha eliminado un registro"}
        })
      }
    )
  }

  
  switchAction($event:any){ 
    /**
     * Acciones de opciones
     * Sobescribir si se necesita utilizar eventos
     * Utilizar $event.action para la accion a ejecutar (corresponde a opt.action)
     * Utilizar $event.data para los datos a utilizar (corresponde a row)
     */  
    switch($event.action){
      case "delete":
        this.delete($event.data["id"])
        /**
         * No utilizar indice (si se utiliza ordenamiento angular no se refleja el cambio de indices, y se elimina la fila incorrecta)
         * @todo conviene implementar el eliminar directamente en la tabla?
         */
      break;
      default:
        throw new Error("Not Implemented");
    }   
  }


  queryData(): Observable<any>{
    return this.dd.post("ids", this.entityName, this.display$.value).pipe(
      switchMap(
        ids => this.ddrf.getAllGroup(this.entityName, ids, this.configForm.controls)
      )
    )
  }

}
