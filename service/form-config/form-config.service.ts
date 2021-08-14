import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { FormArrayConfig, FormConfig, FormControlsConfig, FormGroupConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {

  public defaultValues(config: FormControlsConfig): any  {
    var dv = {}
    Object.keys(config.controls).forEach(key => {
      switch(config.controls[key].id){
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
      if(config.controls[key].id == "form_array"){
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
  
  initArray(config: FormArrayConfig, form: FormArray, value: [{ [key: string]: any; }]): void {
    form.clear();
    for(var i = 0; i <value.length; i++) form.push(config.factory.formGroup());
    form.patchValue(value)
  }

  /**
   * Se realiza una traduccion del atributo params que contienen {{key}}
   */
   public matchParams(params: any, form:FormGroup){
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
}
