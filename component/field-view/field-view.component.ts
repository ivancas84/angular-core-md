import { Component, Input} from '@angular/core';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-field-view',
  templateUrl: './field-view.component.html',
})
export class FieldViewComponent { //1.2
  /**
   * Vista de campo
   * En base a un conjunto de opciones define la vista mas adecuada para el valor del campo
   * El valor puede ser un tipo simple o estar representado por un FormControl 
   */
  
  @Input() field: any; //dependiendo del valor a mostrar puede ser un tipo simple o FormControl
  @Input() fieldViewOptions: FieldViewOptions;
}
/**
 * "FieldViewOptions":">=1"
 * "InputDateComponent":">=1"
 * "InputTimepickerComponent":">=1"
 * "InputCheckboxComponent":">=1"
 * "InputYearComponent":">=1"
 * "InputTextareaComponent":">=1"
 * "InputSelectParamComponent":">=1"
 * "InputSelectComponent":">=1"
 * "InputSelectCheckboxComponent":">=1"
 * "InputAutocompleteComponent":">=1"
 * "InputTextComponent":">=1"
 * "LabelComponent":">=1"
 * "FieldLabelComponent":">=1"
 * "FieldTreeComponent":">=1"
 */