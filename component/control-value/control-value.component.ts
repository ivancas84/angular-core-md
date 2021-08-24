import { Component, Input, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormConfig } from '@class/reactive-form-config';

export class ControlValueConfig extends FormConfig {
  componentId: string =  "control_value"

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
  selector: 'core-control-value',
  templateUrl: './control-value.component.html',
})
export class ControlValueComponent implements ControlComponent {
  @Input() config: ControlValueConfig;
  @Input() control: FormControl;

}
