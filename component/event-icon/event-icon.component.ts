import { Component, Input, OnInit} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
 
export class EventIconConfig extends FormControlConfig {
  override component: any = EventIconComponent
  icon: string = "info" //icono del boton
  action!: string //accion del evento a realizar
  fieldEvent!: FormControl
  color: string = ""
  title: string = ""

  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-event-icon',
  templateUrl: './event-icon.component.html',
})
export class EventIconComponent implements OnInit {
  @Input() config: EventIconConfig | {[key:string]: any} = {};
  @Input() control?: AbstractControl;
  @Input() index?: number; //debe estar afuera del archivo de configuracion porque es un dato variable


  /**
   * Visualizar opciones 
   * Este componente puede ser utilizado para un AbstractControl
   */

  ngOnInit(){
    if(!this.config.hasOwnProperty("component")) this.config = new EventIconConfig(this.config)
  }
  
  setValue(){
    this.config.fieldEvent.setValue({
      action:this.config.action,
      control:this.control,
      index:this.index
    })
  }
}
