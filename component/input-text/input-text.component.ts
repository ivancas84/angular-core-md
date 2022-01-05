import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';

export class InputTextConfig extends FormControlConfig {
  /**
   * Configuracion de Input Text
   */
  componentId: string = "input_text"
  label?: string
  showLabel: boolean = true
  placeholder?: string = ""
  type?: string = "text"
  /**
   * Atributo type: Se asocia al parametro type del tag input de html 
   */
  widthAux?: string = null
  /**
   * Ancho exclusivo del input
   * se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
   */

  readonly?: boolean = false;

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements ControlComponent, OnInit{
  
  @Input() config: InputTextConfig;
  @Input() control: FormControl;

  ngOnInit(): void {
    if(!this.config.label) this.config.label = getControlName(this.control)
  }
}
