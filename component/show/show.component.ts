import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Display } from '@class/display';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { fastClone } from '@function/fast-clone';

@Component({
  selector: 'core-show',
  template: '',
})
export abstract class ShowComponent implements OnInit { //1.1
  /**
   * Grilla de visualizacion
   */

  readonly entityName: string; //Nombre de la entidad principal
  data: any; //datos principales
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
    protected storage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.load$ = this.route.queryParams.pipe(
      tap(
        queryParams => {
          this.load = false;
          this.params = this.initParams(queryParams);
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

  initParams(params: any){ return params; }

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
          if(!this.length && this.length !== null) return of([]); 
          return this.queryData();
        },
      ),
      tap(
        data => {
          this.data = data;
        }
      ),      
    )
  }

  queryData(): Observable<any>{
    return this.dd.all(this.entityName, this.display)
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

}
