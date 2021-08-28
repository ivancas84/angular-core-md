import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormConfig, FormControlConfig } from '@class/reactive-form-config';

export class ControlDateConfig extends FormControlConfig {
  componentId: string = "control_date"
  format: string = "dd/MM/yyyy"
}

@Component({
  selector: 'core-control-date',
  templateUrl: './control-date.component.html',
})
export class ControlDateComponent implements ControlComponent {
  @Input() config: FormConfig;
  @Input() control: FormControl;


}
