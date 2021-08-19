import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidatorMsg } from '@class/validator-msg';

@Component({
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent {

  @Input() field: FormControl
  @Input() title?: string
  @Input() showTitle: boolean = true
  @Input() placeholder?: string = ""
  @Input() type?: string = "text"
  @Input() width?: string = null
  /**
   * Ancho exclusivo del input
   * se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
   */

  @Input() readonly?: boolean = false;
  @Input() validatorMsgs: ValidatorMsg[] = [];

}
