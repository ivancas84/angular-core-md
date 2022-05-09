import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Display } from '@class/display';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { DataDefinitionFkAllService } from '@service/data-definition/data-definition-fk-all.service';
import { ConfigFormGroupFactory, FormArrayConfig, FormGroupConfig } from '@class/reactive-form-config';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { StructureComponent } from '@component/structure/structure.component';
import { ValidatorsService } from '@service/validators/validators.service';
import { FieldWidthOptions } from '@class/field-width-options';
import { InputTextConfig } from '@component/input-text/input-text.component';

@Component({
  selector: 'core-array',
  template: '',
})
export abstract class ArrayComponent extends StructureComponent implements OnInit {

  entityName!: string
  /**
   * Estructura principal para administrar un array de elementos
   */
  override control: FormArray = new FormArray([]);
  /**
   * Referencia directa del FormArray que formara parte del control
   */
  
  config!: FormArrayConfig
  /**
   * A traves del atributo config se define: 
   *   metodo para crear formGroup del formArray (config.factory)
   *   filtro de campos para la consulta
   */
  length?: number; //longitud total de los datos a mostrar
  
  load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga

  searchControl!: FormGroup
  searchConfig!: FormGroupConfig

  constructor(
    protected override dd: DataDefinitionToolService, 
    protected override route: ActivatedRoute, 
    protected override dialog: MatDialog,
    protected override storage: SessionStorageService,
    protected override router: Router, 
    protected override snackBar: MatSnackBar,
    protected override location: Location, 
    protected ddrf: DataDefinitionFkAllService,
    protected validators: ValidatorsService,
    protected fb: FormBuilder

  ) {
    super(dialog, storage, dd, snackBar, router, location, route)
  }

  override ngOnInit(){
    this.config.initFactory();
    this.initSearch();
    super.ngOnInit()
  }

  getStorageValues(): any {
    return this.control.getRawValue()
  }

  initSearch(){
    if(!this.searchConfig){
      this.searchConfig = new FormGroupConfig({
        "search":new InputTextConfig({
          label:"Buscar",
          width: new FieldWidthOptions()
        }),
      })
    }
    if(!this.searchControl) {
      var c = new ConfigFormGroupFactory(this.searchConfig)
      this.searchControl = c.formGroup()
    }
  }

  
  override loadParams(){
    this.loadParams$ = this.route.queryParams.pipe(
      map(
        queryParams => { 
          this.initParams(queryParams);
          this.initDisplay();
          return true;
        },
        (error: any) => { 
          console.log(error)
        }
      ),
    )
  }

  loadDisplay(){
    /**
     * Se define un load independiente para el display, es util para reasignar
     * valores directamente al display y reinicializar por ejemplo al limpiar
     * o resetear el formulario
     */
    this.loadDisplay$ = this.display$.pipe(
      switchMap(
        () => {
          this.load = false
          return this.initLength();
        }
      ),
      switchMap(
        () =>   (this.length === 0) ? of([]) : this.initData()
      ),
      map(
        data => {
          this.setData(data)
          return this.load = true;
        }
      ),
    )
  }

  setData(data: any[]){
    if (!this.length && data.length) this.length = data.length
    this.control.clear();
    for(var i = 0; i <data.length; i++) this.control.push(this.config.factory!.formGroup());
    this.control.patchValue(data)
  }

  override initDisplay() {
    var display = new Display();
    display.setSize(100);
    display.setParamsByQueryParams(this.params);
    this.display$.next(display)
  }

  initLength(): Observable<any> {
    /**
     * Si no se desea procesar la longitud, retornar of(null)
     */
    return this.dd.post("count", this.entityName, this.display$.value).pipe(
      catchError(
        (error) => {
          this.dialog.open(DialogAlertComponent, {
            data: {title: "Error", message: error.error}
          })
          this.length = 0
          return of(null)
        }
      ),    
      map(
        count => {
          return this.length = count; 
        }
      )
    );
  }

  override initData(): Observable<any>{
    return this.dd.post("ids", this.entityName, this.display$.value).pipe(
      switchMap(
        ids => this.ddrf.getAllConfig(this.entityName, ids, this.config.controls)
      )
    )
  }

  override persist(): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd._post("persist_rel_rows", this.entityName, this.serverData())
  }

  override switchOptField(data: { action: string; [x: string]: any; }){
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
      case "remove": 
        var index = data["index"]
        var fa: FormArray = data["control"].parent as FormArray
        var fg: FormGroup = fa.controls[index] as FormGroup
        if(!fg.get("id")!.value) fa.removeAt(index)
        else fg.get("_mode")!.setValue("delete");
      break;
      default: super.switchOptField(data);
    }
  }
}
