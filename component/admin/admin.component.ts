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
import { EventButtonConfig } from '@component/event-button/event-button.component';
import { EventIconConfig } from '@component/event-icon/event-icon.component';


@Component({
  selector: 'core-admin',
  template: './admin.component.html',
})
export abstract class AdminComponent extends StructureComponent implements OnInit{

  config: FormStructureConfig
  /**
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
   * "per-detalle_persona/persona": relacion um donde alumno.persona um detalle_persona, 
   *   ((la relacion entre persona y detalle_persona se traduce en base al prefijo "per")) 
   */

  form: FormGroup
  /**
   * si no existe, se crea.
   * si no existe alguna subestructura, se crea en base a config.
   */

  sort = (a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0)
  }

  optFooter: AbstractControlViewOption[] = [ //opciones de componente
    {
      config: new EventButtonConfig({
        text: "Aceptar", //texto del boton
        action: "submit", //accion del evento a realizar
        color: "primary",
        fieldEvent: this.optField
      }),
    },
    {
      config: new EventIconConfig({
        icon: "arrow_back", //texto del boton
        action: "back", //accion del evento a realizar
        color: "accent",
        fieldEvent: this.optField
      })
    },
    {
      config: new EventIconConfig({
        icon: "add", //texto del boton
        action: "clear", //accion del evento a realizar
        color: "accent",
        fieldEvent: this.optField
      })
    },
  ]; 
  
  inputSearchGo: boolean = true; //flag para activar / desactivar componente inputSearchGo

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
     * construccion de form en base a config 
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
     * Se define un load independiente para el display, es util para reasignar valores directamente al display y reinicializar
     * por ejemplo al limpiar o resetear el formulario
     */
    this.loadDisplay$ = this.display$.pipe(
      switchMap(
        () => {
          return this.initData();
        }
      ),
      map(
        data => {
          /**
           * @todo es posible evitar una doble asignacion?
           */
          this.storageValues = this.storage.getItem(this.router.url)
          this.storage.removeItemsPrefix(emptyUrl(this.router.url))
          this.form.reset()
          
          this.fc.initValue(this.config, this.form, this.fc.defaultValues(this.config))
          if(!isEmptyObject(data)) this.fc.initValue(this.config, this.form, data);
          if(!isEmptyObject(this.storageValues)) {
            console.log(this.storageValues)
            this.fc.initValue(this.config, this.form, this.storageValues)
          }
          /**
           * Debe hacerse una doble asignacion porque no todos los valores se encuentran en el storage, solo los que no se encuentran deshabilitados
           * No se recomienda deshabilitar valores del formArray, no esta correctamente probado el storage y la inicializacion para estos valores
           */

           //this.storage.removeItemsPrefix(emptyUrl(this.router.url));

          return true;
        }
      ),
    )
  }

  initDisplay(){ this.display$.next(this.params);  }

  initData(): Observable<any> {
    return  (!isEmptyObject(this.display$.value)) ? this.queryData() : of({});
  }

  queryData(): Observable<any> {
    return this.relFk.uniqueGroup(this.entityName, this.display$.value, this.config.controls).pipe(
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
