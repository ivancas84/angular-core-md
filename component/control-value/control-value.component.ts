import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';

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
export class ControlValueComponent implements ControlComponent {
  @Input() config!: ControlValueConfig;
  @Input() control!: FormControl;
}
