import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { ConfigFormGroupFactory, FormArrayConfig, FormConfig, FormControlConfig, FormControlsConfig, FormGroupConfig } from '@class/reactive-form-config';
import { EventButtonConfig } from '@component/event-button/event-button.component';
import { EventIconConfig } from '@component/event-icon/event-icon.component';
import { TableDynamicConfig } from '@component/table/table-dynamic.component';
import { arrayColumn } from '@function/array-column';
import { fastClone } from '@function/fast-clone';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {

  /**
   * Herramientas de uso comun para la configuracion de formularios 
   */

  public defaultValues(config: FormControlsConfig): any  {
    var dv = {}
    Object.keys(config.controls).forEach(key => {
      switch(config.controls[key].controlId){
        case "form_control": case "form_array":
          dv[key] = config.controls[key].default;
        break;

        case "form_group":
          dv[key] = this.defaultValues(config.controls[key] as FormControlsConfig);
        break;
      }
    })
    return dv;
  } 

  public getName(control: AbstractControl): string | null {
    let group = <FormGroup>control.parent;

    if (!group) {
      return null;
    }

    let name: string;

    Object.keys(group.controls).forEach(key => {
      let childControl = group.get(key);

      if (childControl !== group) {
        return;
      }

      name = key;
    });

    return name;
  }

  initValue(config: FormControlsConfig, form: FormGroup, value: { [key: string]: any; }): void {
    Object.keys(value).forEach(key => { 
      if(config.controls[key].controlId == "form_array"){
        this.initArray(
          config.controls[key] as FormArrayConfig, 
          form.controls[key] as FormArray, 
          value[key]
        )
      } else {
        form.controls[key].patchValue(value[key])
      }
    });
  }
  
  initArray(config: FormArrayConfig, formArray: FormArray, value: [{ [key: string]: any; }]): void {
    formArray.clear();
    for(var i = 0; i <value.length; i++) formArray.push(config.factory.formGroup());
    formArray.patchValue(value)
  }

   public matchParams(params: any, form:FormGroup){
    /**
     * Se realiza una traduccion del atributo params que contienen {{key}}
     */

    var p = fastClone(params)
    for(var i in p){
      if(p.hasOwnProperty(i)){
        var key = p[i].match(/\{\{(.*?)\}\}/)
        if(key) {
          if(!form[key[1]].value) return null; //si no hay coincidencia de parametros se retorna null?
          p[i] = form[key[1]].value;
        }
      }
    }
    return p;
  }

  initFormArrayConfigAdmin(config: FormArrayConfig){
    /**
     * Inicializar elementos de administracion de un FormArrayConfig
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

  formGroupAdmin(config:  FormGroupConfig){
    if(!config.contains("id")) config.addControl("id", new FormControlConfig(null))
    var c = new ConfigFormGroupFactory(config)
    return c.formGroup();
  }

}
