import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';

@Component({
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent {
  @Input() field: FormControl
  @Input() title?: string
  @Input() placeholder?: string = ""
  @Input() uniqueRoute?: string //Ruta de administracion para valor unico (si no se define no se activa enlace)
  @Input() type?: string = "text"
  @Input() width?: string = null
  
  get uniqueParams() {
    /**
     * Definir parametros de administracion si se ingresa un valor unico
     */
    let queryParams = {};
    queryParams[getControlName(this.field)] = this.field.value;
    return queryParams;
  }
  
}
