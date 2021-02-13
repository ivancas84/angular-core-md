import { Component, Input} from '@angular/core';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-field-view',
  templateUrl: './field-view.component.html',
})
export class FieldViewComponent {
  /**
   * Vista de campo
   * En base a un conjunto de opciones define la vista mas adecuada para el valor del campo
   * El valor puede ser un tipo simple o estar representado por un FormControl 
   */
  
  @Input() field: any; //dependiendo del valor a mostrar puede ser un tipo simple o FormControl
  @Input() fieldViewOptions: FieldViewOptions;

}
