import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
 
@Component({
  selector: 'core-event-button',
  templateUrl: './event-button.component.html',
})
export class EventButtonComponent {
  /**
   * Visualizar opciones
   */

  @Input() text: string //texto del boton
  @Input() action: string //accion del evento a realizar
  @Input() color: string
  @Input() title?: string
  @Input() field: FormControl

  setValue(){
    this.field.setValue(this.action)
  }
}
