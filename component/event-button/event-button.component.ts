import { Component, Input, OnInit} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
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
  @Input() control?: AbstractControl = null
  @Input() fieldEvent: FormControl


  setValue(){
    this.fieldEvent.setValue({action:this.action,control:this.control})
  }
}
