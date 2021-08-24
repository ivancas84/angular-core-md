import { Input, Component, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';

export class InputCheckboxConfig extends FormControlConfig {
  component: Type<any> = InputCheckboxComponent
  label?: string;
  labelDisabled?: boolean = false;

  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

@Component({
  selector: 'core-input-checkbox',
  templateUrl: './input-checkbox.component.html',
})
export class InputCheckboxComponent implements ControlComponent {
  /**
   * Checbox no admite placeholder, error unique, error require.
   * Se define por defecto un error general que puede ser validado como further_error
   */
  @Input() config: InputCheckboxConfig;
  @Input() control: FormControl;

  


   
}
