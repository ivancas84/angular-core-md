import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';

export class ControlDateConfig extends FormControlConfig {
  override component: any = ControlDateComponent
  format: string = "dd/MM/yyyy"
  
  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-control-date',
  templateUrl: './control-date.component.html',
})
export class ControlDateComponent {
  @Input() config!: ControlDateConfig;
  @Input() control!: FormControl;


}
