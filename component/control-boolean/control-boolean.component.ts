import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormConfig, FormControlConfig } from '@class/reactive-form-config';

export class ControlBooleanConfig extends FormControlConfig {
  componentId: string = "control_boolean"
  format: any[] = ["Sí","No"] //@todo por el momento el formato no esta disponible
}

@Component({
  selector: 'core-control-boolean',
  templateUrl: './control-boolean.component.html',
})
export class ControlBooleanComponent implements ControlComponent {
  @Input() config: ControlBooleanConfig;
  @Input() control: FormControl;


}
