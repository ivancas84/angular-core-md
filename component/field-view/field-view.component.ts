import { Component, Input} from '@angular/core';
import { FieldConfig } from '@class/field-config';

@Component({
  selector: 'core-field-view',
  templateUrl: './field-view.component.html',
})
export class FieldViewComponent {
  /**
   * Define como debe visualizarse un campo
   */
  @Input() fieldConfig: FieldConfig; //FieldViewOptions
  @Input() data: { [index: string]: any }; //Conjunto de campos
  /**
   * Por que se recibe un conjunto de campos?
   * La visualizacion de un campo puede requerir enlaces u otros elementos que quieren los valores de los campos asociados
   */
}
