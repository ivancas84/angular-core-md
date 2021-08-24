import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';

export class InputTextConfig extends FormControlConfig {
  componentId: string = "input_text"
  label?: string
  showLabel: boolean = true
  placeholder?: string = ""
  type?: string = "text"
  widthAux?: string = null
  /**
   * Ancho exclusivo del input
   * se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
   */

  readonly?: boolean = false;

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
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements ControlComponent{
  @Input() config: InputTextConfig;
  @Input() control: FormControl;
}
