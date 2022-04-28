import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';

export class InputTimepicker2Config extends FormControlConfig {
  /**
   * Configuracion de Input Text
   */
  override component: any = InputTimepicker2Component
  showLabel: boolean = true
  placeholder: string = ""
  type: string = "text"
  /**
   * Atributo type: Se asocia al parametro type del tag input de html 
   */
  widthAux?: string
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
  selector: 'core-input-timepicker2',
  templateUrl: './input-timepicker2.component.html',
})
export class InputTimepicker2Component implements OnInit{
  
  @Input() config!: InputTimepicker2Config;
  @Input() control!: FormControl;

  ngOnInit(): void {
    if(!this.config.label) {
      var n = getControlName(this.control)
      this.config.label = titleCase(n.substring(n.indexOf("-")+1).replace("_"," "))
    }

    if(this.control.value){
      var timetext = new Date(this.control.value).toTimeString().split(' ')[0];
      this.control.setValue(timetext)
    }
  }
}


