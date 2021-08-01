import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Display } from '@class/display';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { FormArrayExt, FormGroupExt } from '@class/reactive-form-ext';
import { DataDefinitionRelFieldsService } from '@service/data-definition/data-definition-rel-fields.service';

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
  structure: FormArrayExt
  length?: number; //longitud total de los datos a mostrar
  /**
   * undefined: No se procesara la longitud
   * null: Se considera que no hay datos
   */
  
  display: Display; //parametros de visualizacion
  params: { [x: string]: any; } //Parametros del componente
  load$: Observable<any>; //Disparador de observables
  load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga

  constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
    protected storage: SessionStorageService,
    protected ddrf: DataDefinitionRelFieldsService

  ) {}

  abstract configForm()

  ngOnInit(): void {
    this.configForm();
    this.load$ = this.route.queryParams.pipe(
      tap(
        queryParams => {
          this.load = false;
          this.initParams(queryParams);
          this.initDisplay();          
        },
      ),
      switchMap(
        () => this.initLength()
      ),
      switchMap(
        () => this.initData()
      ),
      map(
        ()=> {return this.load = true}
      )
    );
  }

  initParams(params: any){ 
    this.params = params; 
  }

  initDisplay() {
    this.display = new Display();
    this.display.setSize(100);
    this.display.setParamsByQueryParams(this.params);
  }

  initLength(): Observable<any> {
    /**
     * Si no se desea procesar la longitud, retornar of(undefined)
     */
    return this.dd.post("count", this.entityName, this.display).pipe(
      catchError(
        (error) => {
          this.dialog.open(DialogAlertComponent, {
            data: {title: "Error", message: error.error}
          })
         return of(null);
        }
      ),    
      tap(
        count => { this.length = count; }
      )
    );
  }

  initData(): Observable<any>{
    /**
     * Dependiendo de las caracteristicas de la interfaz,
     * puede sobrescribirse omitiendo el uso de display,
     * y directamente utilizar params.
     * Si se utiliza search considerar que tambien esta configurado con display.
     */
    return of({}).pipe(
      switchMap(
        () => {
          if(!this.length && this.length === null) {
            return of([]); 
          }
          return this.queryData();
        },
      ),
      tap(
        data => {
          this.structure.initValue(data);
        }
      ),      
    )
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
        }
      ),
      switchMap(
        () => {
          this.length--;
          return this.initData()
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
    return this.dd.post("ids", this.entityName, this.display).pipe(
      switchMap(
        ids => this.ddrf.getAllGroup(this.entityName, ids, this.structure.factory.formGroup())
      )
    )
  }

}
