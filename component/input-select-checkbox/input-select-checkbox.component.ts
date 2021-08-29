import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';

export class InputSelectCheckboxConfig extends FormControlConfig {
  componentId: string = "input_select_checkbox"
  options: any[] = ["Sí", "No"];
  /**
   * El primer valor sera transformado al string "true"
   * El segundo a "false"
   */
  label: string = "Seleccione";

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
  selector: 'core-input-select-checkbox',
  templateUrl: './input-select-checkbox.component.html',
})
export class InputSelectCheckboxComponent implements ControlComponent {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() config: InputSelectCheckboxConfig;
  @Input() control: FormControl;

  isEven(n){
    return n % 2 == 0;
  }
}
