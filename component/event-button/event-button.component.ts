import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { startWith } from 'rxjs';
 
export class EventButtonConfig extends FormControlConfig {
  override component: any = EventButtonComponent
  text!: string //texto del boton
  action!: string //accion del evento a realizar
  color: string = ""
  fieldEvent!: FormControl
  disabled: boolean = false

  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }

}

@Component({
  selector: 'core-event-button',
  templateUrl: './event-button.component.html',
})
export class EventButtonComponent implements OnInit{
  @Input() config: EventButtonConfig | {[key:string]: any} = {};
  @Input() control!: FormControl;


  ngOnInit(){
    if(!this.config.hasOwnProperty("component")) this.config = new EventButtonConfig(this.config)
  }

  setValue(){
    this.config.fieldEvent.setValue({action:this.config.action,control:this.control})
  }
}
