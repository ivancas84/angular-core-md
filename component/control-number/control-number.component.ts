import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';

export class ControlNumberConfig extends FormControlConfig {
  override component:any = ControlNumberComponent
  digitsInfo:string = ""
  locale:string = "es-AR"

  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-control-number',
  templateUrl: './control-number.component.html',
})
export class ControlNumberComponent {
  @Input() config!: ControlNumberConfig;
  @Input() control!: FormControl;
}
