import { Component, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
 
export class EventButtonConfig extends FormControlConfig {
  override component: any = EventButtonComponent
  text!: string //texto del boton
  action!: string //accion del evento a realizar
  color: string = ""
  fieldEvent!: FormControl

  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }

}

@Component({
  selector: 'core-event-button',
  templateUrl: './event-button.component.html',
})
export class EventButtonComponent {
  @Input() config: EventButtonConfig | {[key:string]: any} = {};
  @Input() control!: FormControl;


  setValue(){
    if(!this.config.hasOwnProperty("component")) this.config = new EventButtonConfig(this.config)
    this.config.fieldEvent.setValue({action:this.config.action,control:this.control})
  }
}
