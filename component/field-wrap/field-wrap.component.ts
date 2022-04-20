import { Component, Input} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ControlComponent, FormConfig } from '@class/reactive-form-config';
 

@Component({
  selector: 'core-field-wrap',
  template: '',
})
export class FieldWrapComponent implements ControlComponent{
  /**
   * Envoltura para visualizar el campo
   */
  
  @Input() config!: FormConfig //configuracion
  @Input() control!: AbstractControl //configuracion

}
