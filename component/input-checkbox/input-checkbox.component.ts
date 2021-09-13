import { Input, Component, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';

export class InputCheckboxConfig extends FormControlConfig {
  componentId: string = "input_checkbox"
  label?: string;
  labelDisabled?: boolean = false;
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
