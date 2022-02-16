import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';

export class ControlLabelConfig extends FormControlConfig {
  componentId: string = "control_label"
  entityName: string

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-control-label',
  templateUrl: './control-label.component.html',
})
export class ControlLabelComponent implements ControlComponent, OnInit {
  @Input() config: ControlLabelConfig;
  @Input() control: FormControl;

  ngOnInit(): void {
    if(!this.config.entityName) {

      var n = getControlName(this.control)
      this.config.entityName = n.substring(n.indexOf("-")+1)
    } 
    
    
  }

}
