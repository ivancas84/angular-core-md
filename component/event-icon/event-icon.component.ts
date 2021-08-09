import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
 
@Component({
  selector: 'core-event-icon',
  templateUrl: './event-icon.component.html',
})
export class EventIconComponent {
  /**
   * Visualizar opciones
   */

  @Input() icon: string //icono del boton
  @Input() action: string //accion del evento a realizar
  @Input() color: string
  @Input() title?: string
  @Input() field?: FormControl = null
  @Input() fieldEvent: FormControl

  setValue(){
    this.fieldEvent.setValue({action:this.action,field:this.field})
  }
}
