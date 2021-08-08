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
  @Input() field: FormControl

  setValue(){
    this.field.setValue(this.action)
  }
}
