import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ConfigFormGroupFactory, FormArrayConfig, FormConfig, FormControlConfig, FormControlsConfig, FormGroupConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {

  /**
   * Herramientas de uso comun para la configuracion de formularios 
   */

  public defaultValues(config: FormControlsConfig): any  {
    var dv:{[key:string]:any} = {}
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

  public getName(control: AbstractControl): string {
    let group = <FormGroup>control.parent;

    let name: string = "";

    if (!group) return name;
    
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
        (value[key]) ?  form.controls[key].patchValue(value[key]) : form.controls[key].patchValue({}) 
      }
    });
  }
  
  initArray(
    config: FormArrayConfig, 
    formArray: FormArray, 
    value: [{ [key: string]: any; }]
  ): void {
    formArray.clear();
    for(var i = 0; i <value.length; i++) formArray.push(config.factory!.formGroup());
    formArray.patchValue(value)
  }

   public matchParams(params: any, form:FormGroup){
    /**
     * Se realiza una traduccion del atributo params que contienen {{key}}
     */

    var p = fastClone(params)
    for(var i in p){
      if(p.hasOwnProperty(i)){
        var key: string = p[i].match(/\{\{(.*?)\}\}/)
        if(key) {
          if(!form.controls[key[1]].value) return null; //si no hay coincidencia de parametros se retorna null?
          p[i] = form.controls[key[1]].value;
        }
      }
    }
    return p;
  }

  addFormGroupConfig(control: FormGroup, config: FormGroupConfig){
    /**
     * Agregar al control, los campos faltantes de config
     */
     var c = new ConfigFormGroupFactory(config)
     c.formGroupAssign(control);
  }

  addFormGroupConfigAdmin(control: FormGroup, config: FormGroupConfig){
    if(!config.contains("id")) config.addControl("id", new FormControlConfig(null))
    this.addFormGroupConfig(control, config);
  }


  initFormArrayConfigAdmin(config: FormArrayConfig){

    /**
     * Inicializar elementos de administracion de un FormArrayConfig
     * 
     * @todo Deberia reducirse la cantidad de caracteristicas, muchas pertenencen a 
     * Admin. Deben reimplementarse el metodo en Admin
     * 
     * @todo Mas que un FormArrayConfig, el parametro es un TableAdminConfig o
     * similar, e=se estan manipulando caracteristicas como por ejemplo optTitle y
     * optColumn
     */
    if(!config.factory) config.factory = new ConfigFormGroupFactory(config)
    if(!config.contains("_mode")) config.addControl("_mode", new FormControlConfig(null))
    if(!config.contains("id")) config.addControl("id", new FormControlConfig(null))

  }


  

  
}
