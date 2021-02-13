import { Component, Input} from '@angular/core';
import { FieldViewOptions } from '@component/field-view/field-view.component';

@Component({
  selector: 'core-field-value',
  templateUrl: './field-value.component.html',
})
export class FieldValueComponent {
  
  @Input() field: any; //dependiendo del valor a mostrar puede ser un FieldControl o cualquier otro valor
  @Input() fieldViewOptions: FieldViewOptions;

}
