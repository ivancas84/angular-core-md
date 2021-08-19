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
import { AbstractControlOption, FormGroupConfig, FormStructureConfig } from '@class/reactive-form-config';
import { StructureComponent } from '@component/structure/structure.component';
import { AbstractControlViewOptions, EventButtonViewOptions, EventIconViewOptions } from '@class/abstract-control-view-options';


@Component({
  selector: 'core-admin',
  template: './admin.component.html',
})
export abstract class AdminComponent extends StructureComponent implements OnInit{
  form: FormGroup
  config: FormStructureConfig
  nestedComponentsSort = (a: KeyValue<string,AbstractControlViewOptions>, b: KeyValue<string,AbstractControlViewOptions>): number => {
    return a.value.pos > b.value.pos ? 1 : (b.value.pos > a.value.pos ? -1 : 0)
  }

  nestedComponents: { [x: string]: AbstractControlViewOptions } = {}

  optFooter: AbstractControlOption[] = [ //opciones de componente
    new AbstractControlOption({
      viewOptions: new EventButtonViewOptions({
        text: "Aceptar", //texto del boton
        action: "submit", //accion del evento a realizar
        color: "primary",
        fieldEvent: this.optField
      }),
      config: new FormGroupConfig({}),
    }),

    new AbstractControlOption({
      viewOptions: new EventIconViewOptions({
        icon: "add", //texto del boton
        action: "clear", //accion del evento a realizar
        color: "accent",
        fieldEvent: this.optField
      }) ,
      config: new FormGroupConfig({}),
    }),

    new AbstractControlOption({
      viewOptions: new EventIconViewOptions({
        icon: "arrow_back", //texto del boton
        action: "back", //accion del evento a realizar
        color: "accent",
        fieldEvent: this.optField
      }),
      config: new FormGroupConfig({}),
    }),
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
          this.form.reset()
          this.fc.initValue(this.config, this.form, this.fc.defaultValues(this.config))
          if(!isEmptyObject(data)) this.fc.initValue(this.config, this.form, data);
          if(!isEmptyObject(this.storageValues)) this.fc.initValue(this.config, this.form, this.storageValues)
          /**
           * Debe hacerse una doble asignacion porque no todos los valores se encuentran en el storage, solo los que no se encuentran deshabilitados
           * No se recomienda deshabilitar valores del formArray, no esta correctamente probado el storage y la inicializacion para estos valores
           */
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
