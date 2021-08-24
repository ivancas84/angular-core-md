import { Component, Input, Type} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ControlComponent, FormConfig } from '@class/reactive-form-config';
 
export class EventIconConfig extends FormConfig {
  componentId: string = "event_icon"
  icon: string //icono del boton
  action: string //accion del evento a realizar
  fieldEvent: FormControl
  color?: string
  title?: string

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
  selector: 'core-event-icon',
  templateUrl: './event-icon.component.html',
})
export class EventIconComponent implements ControlComponent {
  @Input() config: EventIconConfig;
  @Input() control: AbstractControl;
  @Input() index?: number; //debe estar afuera del archivo de configuracion porque es un dato variable


  /**
   * Visualizar opciones 
   * Este componente puede ser utilizado para un AbstractControl
   */

  setValue(){
    console.log(this.config.fieldEvent)
    this.config.fieldEvent.setValue({
      action:this.config.action,
      control:this.control,
      index:this.index
    })
  }
}
