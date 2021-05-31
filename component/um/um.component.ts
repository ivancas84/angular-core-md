import { Component, Input} from '@angular/core';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-um',
  templateUrl: './um.component.html',
})
export class UmComponent {
  /**
   * Visualizar un conjunto de relaciones UM previamente definidas y pasadas en @Input data.
   * Las relaciones se visualizan a traves de una lista
   * Se visualizan solo los campos indicados en el @Input fields
   */
  @Input() data: any; //array de relaciones um
  @Input() fields: FieldViewOptions; //campos a visualizar de las relaciones um

}
