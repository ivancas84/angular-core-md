import { Component, Input} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormConfig } from '@class/reactive-form-config';
 

@Component({
  selector: 'core-field-wrap',
  template: '',
})
export class FieldWrapComponent {
  /**
   * Envoltura para visualizar el campo
   */
  
  @Input() config!: FormConfig
  @Input() control!: AbstractControl

}
