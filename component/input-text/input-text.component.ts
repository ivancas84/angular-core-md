import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';

export class InputTextConfig extends FormControlConfig {
  /**
   * Configuracion de Input Text
   */
  override component: any= InputTextComponent
  showLabel: boolean = true
  placeholder: string = ""
  type: string = "text"
  /**
   * Atributo type: Se asocia al parametro type del tag input de html 
   */
  width?: string
  /**
   * Ancho exclusivo del input
   * se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
   */

  readonly: boolean = false;

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements OnInit{
  
  @Input() config!: InputTextConfig;
  @Input() control!: FormControl;

  ngOnInit(): void {
    if(!this.config.label) {
      var n = getControlName(this.control)
      this.config.label = titleCase(n!.substring(n!.indexOf("-")+1).replace("_"," "))
    }
  }
}


