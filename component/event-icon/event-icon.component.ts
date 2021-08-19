import { Component, Input} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
 
@Component({
  selector: 'core-event-icon',
  templateUrl: './event-icon.component.html',
})
export class EventIconComponent {
  /**
   * Visualizar opciones 
   * Este componente puede ser utilizado para un AbstractControl
   */

  @Input() icon: string //icono del boton
  @Input() action: string //accion del evento a realizar
  @Input() fieldEvent: FormControl
  @Input() color?: string
  @Input() title?: string
  @Input() control?: AbstractControl = null
  @Input() index?: number //indice opcional para el caso de utilizar FormArray
  

  setValue(){
    this.fieldEvent.setValue({
      action:this.action,
      control:this.control,
      index:this.index
    })
  }
}
