import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';

export class ControlLabelConfig extends FormControlConfig {
  componentId: string = "control_label"
  entityName: string

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
  selector: 'core-control-label',
  templateUrl: './control-label.component.html',
})
export class ControlLabelComponent implements ControlComponent {
  @Input() config: ControlLabelConfig;
  @Input() control: FormControl;


}
