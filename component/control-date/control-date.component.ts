import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormConfig, FormControlConfig } from '@class/reactive-form-config';

export class ControlDateConfig extends FormControlConfig {
  component: any = ControlDateComponent
  format: string = "dd/MM/yyyy"
  
  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-control-date',
  templateUrl: './control-date.component.html',
})
export class ControlDateComponent implements ControlComponent {
  @Input() config: FormConfig;
  @Input() control: FormControl;


}
