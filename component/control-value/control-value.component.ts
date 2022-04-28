import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';

export class ControlValueConfig extends FormControlConfig {
  override component:any = ControlValueComponent

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-control-value',
  templateUrl: './control-value.component.html',
})
export class ControlValueComponent {
  @Input() config!: ControlValueConfig;
  @Input() control!: FormControl;
}
