import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Display } from '@class/display';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { DataDefinitionRelFieldsService } from '@service/data-definition/data-definition-rel-fields.service';
import { FormArrayConfig, FormControlOption, FormStructureConfig } from '@class/reactive-form-config';
import { FormArray, FormGroup } from '@angular/forms';
import { FormConfigService } from '@service/form-config/form-config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { StructureComponent } from '@component/structure/structure.component';
import { ValidatorsService } from '@service/validators/validators.service';
import { AbstractControlViewOptions, TableViewOptions } from '@class/abstract-control-view-options';


@Component({
  selector: 'core-show',
  template: './show.component.html',
})
export abstract class ShowComponent extends StructureComponent implements OnInit {
  /**
   * Estructura principal para administrar un conjunto de tuplas
   */

  form: FormArray = new FormArray([])
  config: FormArrayConfig
  length?: number; //longitud total de los datos a mostrar
  loadLength: boolean = true; //flag para indicar que se debe consultar longitud
  
  load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga
  nestedComponent: AbstractControlViewOptions = new TableViewOptions() //Debe implementar AbstractControlViewOptionsArray

  searchForm: FormGroup
  searchConfig: FormStructureConfig

  display$:BehaviorSubject<Display> = new BehaviorSubject(null) //parametros de consulta


  constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
    protected storage: SessionStorageService,
    protected ddrf: DataDefinitionRelFieldsService,
    protected fc: FormConfigService,
    protected router: Router, 
    protected snackBar: MatSnackBar,
    protected location: Location, 
    protected validators: ValidatorsService
  ) {
    super(dialog, storage, dd, snackBar, router, location, route)
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
          this.fc.initArray(this.config, this.form, data)
          this.nestedComponent["loadLength"] = this.loadLength
          this.nestedComponent["length"] = this.length
          this.nestedComponent["display"] = this.display$.value
          return this.load = true
        }
      ),
    )
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
      map(
        count => {
          return this.length = count; 
        }
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

  queryData(): Observable<any>{
    return this.dd.post("ids", this.entityName, this.display$.value).pipe(
      switchMap(
        ids => this.ddrf.getAllGroup(this.entityName, ids, this.config.controls)
      )
    )
  }

  persist(): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd._post("persist_rel_rows", this.entityName, this.serverData())
  }

  reload(){
    /**
     * Recargar una vez persistido
     */
    this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }
}
