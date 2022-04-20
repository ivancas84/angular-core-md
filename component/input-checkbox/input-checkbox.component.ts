import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';
import { startWith } from 'rxjs/operators';

export class InputCheckboxConfig extends FormControlConfig {
  override component: any = InputCheckboxComponent
  labelDisabled?: boolean = false;

  constructor(attributes: any = {}) {
    super({});
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-checkbox',
  templateUrl: './input-checkbox.component.html',
})
export class InputCheckboxComponent implements ControlComponent, OnInit {
  /**
   * Checbox no admite placeholder, error unique, error require.
   * Se define por defecto un error general que puede ser validado como further_error
   */
  @Input() config!: InputCheckboxConfig;
  @Input() control!: FormControl;

  
  ngOnInit(){
    if(!this.config.label) this.config.label = getControlName(this.control)

    this.control.valueChanges.pipe(
      startWith(this.control.value),
    ).subscribe(
      value => {
        if(typeof value != "boolean") {
            this.control.setValue(false)
        }
      }
    )
  }

   
}
