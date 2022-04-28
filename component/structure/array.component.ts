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
import { ConfigFormGroupFactory, FormArrayConfig, FormGroupConfig, FormStructureConfig } from '@class/reactive-form-config';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormConfigService } from '@service/form-config/form-config.service';
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
  /**
   * Estructura principal para administrar un array de elementos
   */

  formArray: FormArray = new FormArray([]);
  config!: FormArrayConfig
  /**
   * A traves del atributo config se define: 
   *   metodo para crear formGroup del formArray (config.factory)
   *   filtro de campos para la consulta
   */
  length?: number; //longitud total de los datos a mostrar
  
  load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga

  searchControl!: FormGroup
  searchConfig!: FormStructureConfig

  constructor(
    protected override dd: DataDefinitionToolService, 
    protected override route: ActivatedRoute, 
    protected override dialog: MatDialog,
    protected override storage: SessionStorageService,
    protected ddrf: DataDefinitionFkAllService,
    protected fc: FormConfigService,
    protected override router: Router, 
    protected override snackBar: MatSnackBar,
    protected override location: Location, 
    protected validators: ValidatorsService,
    protected fb: FormBuilder

  ) {
    super(dialog, storage, dd, snackBar, router, location, route)
  }

  getStorageValues(): any {
    return this.control.getRawValue()
  }

  override ngOnInit(){
    this.control.addControl(this.entityName, this.formArray)
    this.initConfigFactory();
    this.initSearch();
    super.ngOnInit()
  }


  initConfigFactory(){
    if(!this.config.factory) this.config.factory = new ConfigFormGroupFactory(this.config)
  }

  initSearch(){
    if(!this.searchConfig){
      this.searchConfig = new FormStructureConfig({}, {
        "params":new FormGroupConfig({title:"Opciones"},{
          "search":new InputTextConfig({
            label:"Buscar",
            width: new FieldWidthOptions()
          }),
        })
      }) 
    }
    if(!this.searchControl) {
      var c = new ConfigFormGroupFactory(this.searchConfig.controls["params"])
      this.searchControl = this.fb.group({
        "params": c.formGroup()
      })
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
     * Se define un load independiente para el display, es util para reasignar valores directamente al display y reinicializar
     * por ejemplo al limpiar o resetear el formulario
     */
    this.loadDisplay$ = this.display$.pipe(
      switchMap(
        () => {
          this.load = false
          return this.initLength();
        }
      ),
      switchMap(
        () => this.initData()
      ),
      map(
        data => {
          console.log(data);
          if (!this.length && data.length) this.length = data.length
          this.fc.initArray(this.config, this.control.get(this.entityName) as FormArray, data)
          return this.load = true
        }
      ),
    )
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
    if(this.length === 0) return of([]); 
    return this.queryData();
  }


  queryData(): Observable<any>{
    return this.dd.post("ids", this.entityName, this.display$.value).pipe(
      switchMap(
        ids => this.ddrf.getAllConfig(this.entityName, ids, this.config.controls)
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

  override reload(){
    /**
     * Recargar una vez persistido
     */
    this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

  
}
