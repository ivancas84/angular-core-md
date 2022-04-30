import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { emptyUrl } from '@function/empty-url.function';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { isEmptyObject } from '@function/is-empty-object.function';
import { FormConfigService } from '@service/form-config/form-config.service';
import { FormGroupConfig, FormStructureConfig } from '@class/reactive-form-config';
import { StructureComponent } from '@component/structure/structure.component';
import { fastClone } from '@function/fast-clone';
import { Display } from '@class/display';

@Component({
  selector: 'core-detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent extends StructureComponent implements OnInit{
  /**
   * Componente principal
   */

  config!: FormStructureConfig
  /**
   * @property config: Configuracion de form
   * 
   * @example
   * config: FormStructureConfig = new FormStructureConfig({}, {
   *    "per": new FormGroupConfig({},{
   *      "id": new FormControlConfig({}),
   *      "nombres": new InputTextConfig({}),
   *      ...
   *    }),
   *    "alumno": new FormGroupConfig({title:"Datos de alumno"},{
   *        "id": new FormControlConfig({}),
   *        "anio_ingreso": new InputSelectParamConfig({options:["1","2","3"]}),
   *        ...
   *    }),
   *    "per-detalle_persona/persona": new FormArrayConfig({}, {
   *        "id": new FormControlConfig(),
   *        "descripcion": new  InputTextConfig(),
   *      }
   *    )
   * }
   * 
   * @description
   * "per": relacion fk (la entidad fk se traduce en base al prefijo)
   * "alumno": entidad principal
   * "per-detalle_persona/persona": relacion um que se muestra donde persona um detalle_persona,
   *   los valores de detalle_persona se obtienen a partir de alumno fk persona que se traduce de per 
   *   ((la relacion entre persona y detalle_persona se traduce en base al prefijo "per")) 
   * 
   * @example 2
   *   "comision" ...
   *   "curso/comision"
   * 
   * @description 2
   *   Se visualiza comision u:m curso, para acceder a los datos se utiliza curso.comision
   */

  inputSearchGo: boolean = true;
  /**
   * @property inputSearchGo: Flag para activar / desactivar componente
   * inputSearchGo
   * 
   * El componente InputSearchGo permite buscar y activar una determinada tu-
   * pla de una entidad.
   **/

  formGroup: FormGroup = this.fb.group({})
  /**
   * Referencia directa del FormGroup que formara parte del control
   */

   constructor(
    protected override dialog: MatDialog,
    protected override storage: SessionStorageService,
    protected override dd: DataDefinitionToolService, 
    protected override snackBar: MatSnackBar,
    protected override router: Router, 
    protected override location: Location, 
    protected override route: ActivatedRoute, 
    protected fb: FormBuilder,
    protected fc: FormConfigService
  ) { 
    super(dialog,storage,dd,snackBar,router,location,route)
  }

  override ngOnInit(){
    /**
     * Inicilizaar interfaz
     * 
     * Si no esta definido el subformulario, se crea, y se define configura-
     * cion por defecto en base a la clase de configuracion.
     * 
     * Si existe el subformulario, no se define configuracion por defecto.
     * Este comportamiento esta definido de esta forma para facilitar la 
     * cancelación de valores por defecto, en caso de que se requiera.
     */
    this.ngOnInitDetail()
    super.ngOnInit()
  }

  ngOnInitDetail(){
     
    this.control.addControl(this.entityName, this.formGroup);

    this.fc.addFormGroupConfigAdmin(this.control.controls[this.entityName] as FormGroup, this.config.controls[this.entityName] as FormGroupConfig )

    /**
     * Se puede optar por otros metodos de FormConfigService para inicializar
     *   addFormGroupConfig
     *   addFormArrayConfig (para el caso de formArray, ejecutar previamente 
     *   this.form.addControl(key, this.fb.array([])) )
     *   y ejecutar this.fc.addFormArrayConfig*this.config.controls[key] as FormArrayConfig)
     */
  }


  loadDisplay(){
    /**
     * Definicion de valores en base al display.
     * 
     * La asignacion de valores en base al display, se define asincronicamente,
     * resulta útil para reasignar valores directamente al display y reiniciar,
     * por ejemplo al limpiar o resetear la propiedad "form"
     * 
     * @summary Procedimiento de definicion de datos:
     * Si existen valores del storage, se inicializa el formulario utilizan-
     * zando el storage,  si no existen valores del storage se invoca al meto
     * do initData para inicializar los datos.
     *
     * @description 0: El metodo initData realiza una inicializacion de datos
     * simple, que consulta los datos de la base de datos o define datos por 
     * defecto (habitualmente un conjunto vacio de datos). loadDisplay es un
     * metodo mas avanzado de definicion de datos que utiliza el resultado de
     * initData, el storage y valores por defecto de formConfig
     * 
     */
    this.loadDisplay$ = this.display$.pipe(
      //startWith(null),
      switchMap(
        () => {
          this.storageValues = this.storage.getItem(this.router.url)
          // this.form.reset() comente el reset porque no se si aporta alguna funcionalidad
          this.storage.removeItemsPrefix(emptyUrl(this.router.url))
          console.log(this.storageValues)
          if(!isEmptyObject(this.storageValues)) return of(this.storageValues)
          else{
            return this.initData();}
        }
      ),
      map(
        data => { 

          // this.form.reset() comente el reset porque no se si aporta alguna funcionalidad
          this.fc.initValue(this.config, this.control, this.fc.defaultValues(this.config))
          /**
           * Se asigna inicialmente los valores por defecto, nada me garantiza
           * que el parametro "data" posea todos los valores definidos.
           */
          if(!isEmptyObject(data)) this.fc.initValue(this.config, this.control, data)
          return true;
        }
      ),
    )
  }

  override initDisplay() {
    /**
     * Inicializar propiedad display$
     * 
     * Por defecto se inicializa con la propiedad params
     */
    var display = new Display();
    display.setSize(100); //se asigna size por defecto por las dudas
    display.setParamsByQueryParams(this.params);
    this.display$.next(display)
  }


  initData(): Observable<any> {
    if(isEmptyObject(this.params)) {
      
      var data: any = {};
      data[this.entityName] = {}
      return of(data);
    }
    return this.queryData()
  }

  queryData(): Observable<any>{
    return this.dd.unique(this.entityName, this.params).pipe(
      map(
        (row) => {
          var data: any = {};
          data[this.entityName] = (!row) ? fastClone(this.params) : fastClone(row)
          return data
        }
      )
    )
  }

  persist(): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd._post("persist_rel", this.entityName, this.serverData())
  }

  override reload(){
    /**
     * Recargar una vez persistido
     */
    let route = emptyUrl(this.router.url) + "?id="+this.response["id"];
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

}
