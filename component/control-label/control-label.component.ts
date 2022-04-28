import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';

export class ControlLabelConfig extends FormControlConfig {
  override component: any = ControlLabelComponent
  entityName!: string

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-control-label',
  templateUrl: './control-label.component.html',
})
export class ControlLabelComponent implements OnInit {
  @Input() config: ControlLabelConfig | {[key:string]: any} = {};
  /**
   * Se puede recibir un objeto 
   */
  @Input() control!: FormControl;

  ngOnInit(): void {
    if(!this.config.hasOwnProperty("component")){
      this.config = new ControlLabelConfig(this.config)
    }

    if(!this.config.entityName) {
      var n = getControlName(this.control!)
      this.config.entityName = n!.substring(n!.indexOf("-")+1)
    } 
  }

}
