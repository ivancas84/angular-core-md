import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';

@Component({
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements OnInit {
  @Input() field: FormControl;
  @Input() title?: string;
  @Input() placeholder?: string = "";
 
  adminRoute:string;
  /**
   * Interfaz de administracion para cuando se carga un valor unico
   * @todo puede ser un Input y dar la posibilidad de indicar la interfaz de administración
   */

  fieldName:string;
  /**
   * Nombre del campo, utilizado como filtro para cargar la interfaz de administracion
   */

  ngOnInit(): void {
    this.fieldName = getControlName(this.field);
    this.adminRoute = getControlName(this.field.parent);
  }
 
  get adminParams() {
    /**
     * Definir parametros de administracion si se ingresa un valor unico
     */
    let queryParams = {};
    queryParams[this.fieldName] = this.field.value;
    return queryParams;
  }
  
}
