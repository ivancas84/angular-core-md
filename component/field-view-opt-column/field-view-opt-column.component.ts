import { Component, Input, OnChanges} from '@angular/core';
 
@Component({
  selector: 'core-field-view-opt-column',
  templateUrl: './field-view-opt-column.component.html',
})
export class FieldViewOptColumnComponent {
  /**
   * Visualizar opciones de columna
   * @todo (en construccion) sera utilizado posteriormente en core-table-dynamic
   */

  @Input() path: string;
  @Input() label: string;
  @Input() params: string;
  @Input() icon: string;
  @Input() data: { [index: string]: any }; //conjunto de campos

}
