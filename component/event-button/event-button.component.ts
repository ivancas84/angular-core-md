import { Component, Input, Type} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ControlComponent, FormConfig } from '@class/reactive-form-config';
 
export class EventButtonConfig extends FormConfig {
  componentId: string = "event_button"
  text: string //texto del boton
  action: string //accion del evento a realizar
  color: string
  title?: string
  fieldEvent: FormControl

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
  selector: 'core-event-button',
  templateUrl: './event-button.component.html',
})
export class EventButtonComponent implements ControlComponent{
  @Input() config: EventButtonConfig;
  @Input() control: AbstractControl;


  setValue(){
    this.config.fieldEvent.setValue({action:this.config.action,control:this.control})
  }
}
