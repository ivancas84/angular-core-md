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
import { ConfigFormGroupFactory, FormArrayConfig, FormStructureConfig, SortControl } from '@class/reactive-form-config';
import { StructureComponent } from '@component/structure/structure.component';
import { AbstractControlViewOption } from '@component/abstract-control-view/abstract-control-view.component';


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

  ngOnInit(){
    /**
     * Construccion de form en base a config.
     */
    if(!this.form) this.form = this.fb.group({})
    for(var key in this.config.controls){
      if(!this.form.contains(key))
        switch(this.config.controls[key].controlId){
          case "form_group":
            var c = new ConfigFormGroupFactory(this.config.controls[key])
            this.form.addControl(key, this.fc.formGroupAdmin(this.config.controls[key]))
          break;
          case "form_array":
            this.fc.initFormArrayConfigAdmin(this.config.controls[key] as FormArrayConfig)
            this.form.addControl(key, this.fb.array([]))
          break;
        }
    }
    super.ngOnInit()
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
     * 0) Se inicializan los datos principales (initData) 
     * 
     * 1) se obtienen y elminan los valores del storage
     * 
     * 2) se resetea el formulario
     * 
     * 3) se asigna a form los valores por defecto (definidos en con-
     * fig)
     * 
     * 4) Se asigna a form los valores consultados (indicados en "data").
     * 
     * 5) Se asigna a form los valores definidos en el storage.
     *
     * @description 0: El metodo initData realiza una inicializacion de datos
     * simple, que consulta los datos de la base de datos o define datos por 
     * defecto (habitualmente un conjunto vacio de datos). loadDisplay es un
     * metodo mas avanzado de definicion de datos que utiliza el resultado de
     * initData, el storage y valores por defecto
     *  
     * @description 1: Es necesario definir data y luego storage? Si 
     * existen valores del storage, hace falta definir data? 
     * La propiedad "form" puede tener valores "deshabilitados", este 
     * tipo de valores no se almacena en el storage.
     * 
     * @description 2: Si siempre se consulta a data, es necesario alma-
     * cenar el storage? 
     * El storage se utiliza principalmente para permitir al usuario al-
     * ternar entre distintas interfaces y poder visualizar los cambios
     * realizados en el formulario sin tener que volver a completar. El 
     * objetivo inicial del storage fue para evitar el uso de pop-ups
     * y facilitar la definicion de interfaces directamente.
     * El uso del storage es una caracteristica que funciona, pero aun
     * se encuentra en construccion
     * 
     * @description 3 es posible evitar una triple asignacion? Default, 
     * data y storage? 
     * Por lo indicado en la "description 1", es necesario definir data
     * y luego storage. En cuanto a los valores por defecto, se conside-
     * ra que, el componente puede ser dinamico en cuanto a los datos 
     * que visualiza/administra, no siempre se corresponden directamente
     * con la entidad principal. En este sentido, puede haber campos de-
     * finidos que no se obtengan directamente de una consulta y convie-
     * ne inicializarlos
     * 
     * @description 4: Deshabilitar valores del formArray.
     * Por el momento no se recomienda, no esta correctamente probado el
     * storage y la inicializacion para estos valores 
     */
    this.loadDisplay$ = this.display$.pipe(
      switchMap(
        () => {
          return this.initData();
        }
      ),
      map(
        data => {
          
          this.form.reset()
          
          this.fc.initValue(this.config, this.form, this.fc.defaultValues(this.config))
          
          if(!isEmptyObject(data)) this.fc.initValue(this.config, this.form, data);
          
          this.storageValues = this.storage.getItem(this.router.url)
          this.storage.removeItemsPrefix(emptyUrl(this.router.url))
          if(!isEmptyObject(this.storageValues)) 
            this.fc.initValue(this.config, this.form, this.storageValues)

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
