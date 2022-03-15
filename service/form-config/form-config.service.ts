import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormArrayConfig, FormConfig, FormControlsConfig } from '@class/reactive-form-config';
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
        (value[key]) ?  form.controls[key].patchValue(value[key]) : form.controls[key].patchValue({}) 
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

  addFormGroupConfig(formGroup: FormGroup, config: FormConfig, disabled:boolean = false){
    /**
     * Agregar al formGroup, los campos faltantes de config
     */
    for(var key in config.controls) {
      if(config.controls.hasOwnProperty(key) && !formGroup.contains(key)) {
        var fc = new FormControl({value: config.controls[key].default, disabled: config.controls[key].disabled})
        if(!config.controls[key].label) config.controls[key].label = key;
        if(config.controls[key].required) fc.setValidators(Validators.required)
        formGroup.addControl(key, fc)
        if(disabled) formGroup.disable()
      }
    }
  }

  
}
