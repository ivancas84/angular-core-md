import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FieldViewOptions } from '@class/field-view-options';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService extends FormBuilder{
  /**
   * Extiende FormBuilder para facilitar la definicion de elementos de formularios de uso comun
   */

  public controlFvo(fieldViewOptions: FieldViewOptions, value:any = null): FormControl{
    var f = new FormControl(
      {
        value:value,
        disabled:fieldViewOptions.control.disabled
      }, 
    )

    var v = []
    for(var j = 0; j < fieldViewOptions.control.validatorOpts.length; j++) 
      v.push(fieldViewOptions.control.validatorOpts[j].fn)
    f.setValidators(v)

    var v = []
    for(var j = 0; j < fieldViewOptions.control.asyncValidatorOpts.length; j++)
      v.push(fieldViewOptions.control.asyncValidatorOpts[j].fn)
    f.setAsyncValidators(v)
    return f;
  }

  public groupFvo(fieldsViewOptions: FieldViewOptions[]): FormGroup{
    let fg: FormGroup = this.group({})
    for(var i = 0; i < fieldsViewOptions.length; i++){
      var c = new FormControl(
        {
          value:null,
          disabled:fieldsViewOptions[i].control.disabled
        }, 
      )

      var v = []
      for(var j = 0; j < fieldsViewOptions[i].control.validatorOpts.length; j++) 
        v.push(fieldsViewOptions[i].control.validatorOpts[j].fn)
      c.setValidators(v)

      var v = []
      for(var j = 0; j < fieldsViewOptions[i].control.asyncValidatorOpts.length; j++)
        v.push(fieldsViewOptions[i].control.asyncValidatorOpts[j].fn)
      c.setAsyncValidators(v)

      fg.addControl(
        fieldsViewOptions[i].field, 
        c
      )
    }
    return fg;
    
  }
}
