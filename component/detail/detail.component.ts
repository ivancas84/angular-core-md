import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionFkObjService } from '@service/data-definition/data-definition-fk-obj.service';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { DataDefinitionUmObjService } from '@service/data-definition/data-definition-um-obj.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { emptyUrl } from '@function/empty-url.function';
import { map, switchMap } from 'rxjs/operators';
import { KeyValue, Location } from '@angular/common';
import { isEmptyObject } from '@function/is-empty-object.function';
import { DataDefinitionRelLabelService } from '@service/data-definition/data-definition-rel-label.service';
import { FormConfigService } from '@service/form-config/form-config.service';
import { ConfigFormGroupFactory, FormArrayConfig, FormControlConfig, FormStructureConfig, SortControl } from '@class/reactive-form-config';
import { StructureComponent } from '@component/structure/structure.component';
import { AbstractControlViewOption } from '@component/abstract-control-view/abstract-control-view.component';
import { EventIconConfig } from '@component/event-icon/event-icon.component';


@Component({
  selector: 'core-main',
  template: './main.component.html',
})
export abstract class DetailComponent extends StructureComponent implements OnInit{
  /**
   * Componente principal
   */

  form: FormGroup
  /**
   * @property form: ReactiveForm que almacena los valores que seran visuali-
   * zados o administrados en la interfaz.
   * 
   * Si no existe, se crea.
   * Si no existe alguna subestructura, se crea en base a config.
   */

  config: FormStructureConfig
  /**
   * @property config: Configuracion de form
   * 
   * @example
   * config: FormStructureConfig = new FormStructureConfig({}, {
   *    "per": new FieldsetDynamicConfig({title:"Datos personales"},{
   *      "id": new FormControlConfig({}),
   *      "nombres": new InputTextConfig({}),
   *      ...
   *    }),
   *    "alumno": new FieldsetDynamicConfig({title:"Datos de alumno"},{
   *        "id": new FormControlConfig({}),
   *        "anio_ingreso": new InputSelectParamConfig({options:["1","2","3"]}),
   *        ...
   *    }),
   *    "per-detalle_persona/persona": new TableDynamicConfig({title:"Legajo"}, {
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

  sort = (a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0)
  }
  /**
   * @deprecated?
   * 
   * No se para que esta definida esta propiedad
   */

  optFooter: AbstractControlViewOption[] = []
  /**
   * @property optFooter: Opciones de footer
   **/  

  inputSearchGo: boolean = true;
  /**
   * @property inputSearchGo: Flag para activar / desactivar componente
   * inputSearchGo
   * 
   * El componente InputSearchGo permite buscar y activar una determinada tu-
   * pla de una entidad.
   **/

  constructor(
    protected fb: FormBuilder, 
    protected route: ActivatedRoute, 
    protected router: Router, 
    protected location: Location, 
    protected dd: DataDefinitionToolService, 
    protected validators: ValidatorsService,
    protected storage: SessionStorageService, 
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected relFk: DataDefinitionFkObjService,
    protected relUm: DataDefinitionUmObjService,
    protected ddrl: DataDefinitionRelLabelService, 
    protected fc: FormConfigService
  ) { 
    super(dialog, storage, dd, snackBar, router, location, route)
  }

  getStorageValues(): any {
    return this.form.getRawValue()
  }

  ngOnInit(){
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
    if(!this.form) this.form = this.fb.group({})
    for(var key in this.config.controls){
        switch(this.config.controls[key].controlId){
          case "form_group":
            if(!this.form.contains(key)) this.form.addControl(key, this.fb.group({}))
            if(!this.config.controls[key].contains("id")) this.config.controls[key].addControl("id", new FormControlConfig(null))
            var c = new ConfigFormGroupFactory(this.config.controls[key])
            c.formGroupAssign(this.form.controls[key] as FormGroup);
          break;
          case "form_array":
            if(!this.form.contains(key)) this.form.addControl(key, this.fb.array([]))
            this.initFormArray(this.config.controls[key] as FormArrayConfig)
          break;
        }
    }
    super.ngOnInit()
  }
  
  initFormArray(config: FormArrayConfig){
    /**
     * Inicializar elementos de administracion de un FormArrayConfig
     * 
     * @todo Deberia reducirse la cantidad de caracteristicas, muchas pertenencen a 
     * Admin. Deben reimplementarse el metodo en Admin
     */
    if(!config.factory) config.factory = new ConfigFormGroupFactory(config)
    if(!config.contains("_mode")) config.addControl("_mode", new FormControlConfig(null))
    if(!config.contains("id")) config.addControl("id", new FormControlConfig(null))
    config.optTitle = [] //opciones de titulo

    config.optColumn = [ //columna opciones
      {  //boton eliminar 
        config: new EventIconConfig({
          action:"remove",
          color: "accent",
          fieldEvent:config.optField,
          icon:"delete"
        }),
      }
    ]

    config.optFooter = [ //opciones de pie
      {
        config: new EventIconConfig({
          icon: "add", //icono del boton
          action: "add", //accion del evento a realizar
          fieldEvent: config.optField,
          title: "Agregar"
        }),
      },
    ]

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
      switchMap(
        () => {
          this.storageValues = this.storage.getItem(this.router.url)
          this.form.reset()
          this.storage.removeItemsPrefix(emptyUrl(this.router.url))
          if(!isEmptyObject(this.storageValues)) return of(this.storageValues)
          else return this.initData();
        }
      ),
      map(
        data => {
          this.form.reset()
          this.fc.initValue(this.config, this.form, this.fc.defaultValues(this.config))
          if(!isEmptyObject(data)) this.fc.initValue(this.config, this.form, data);
          return true;
        }
      ),
    )
  }

  initDisplay(){ this.display$.next(this.params); }
    /**
     * Inicializar propiedad display$
     * 
     * Por defecto se inicializa con la propiedad params
     */

  initData(): Observable<any> {
    /**
     * Inicializacion principal de datos
     * 
     * Si esta definido el valor de la propiedad display$ se realiza una con-
     * sulta a la base de datos, sino se define por defecto un conjunto vacio
     * de datos.
     * 
     * @description el metodo loadDisplay realiza una inicializacion avanzada
     * que utiliza el resultado de initData, storage y valores por defecto 
     */
    return (!isEmptyObject(this.display$.value)) ? this.queryData() : of({});
  }

  queryData(): Observable<any> {
    /**
     * Consulta y definicion de datos
     * Se utilizan dos servicios para definir datos, 
     * cada servicio identifica las relaciones correspondientes de la configuracion (fk o um) 
     * y efectua las acciones correspondientes para obtener y asociar datos
     */
    return this.relFk.uniqueConfig(this.entityName, this.display$.value, this.config.controls).pipe(
      switchMap(
        row => {
          return this.relUm.group(this.entityName, row, this.config.controls)
        }
      ),
    )
    //return this.dd.unique(this.entityName, this.display$.value) 
    //return this.dd.post(this.queryApi, this.entityName, this.display$.value);
  }

  persist(): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd._post("persist_rel", this.entityName, this.serverData())
  }

  reload(){
    /**
     * Recargar una vez persistido
     */
    let route = emptyUrl(this.router.url) + "?id="+this.response["id"];
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

}
