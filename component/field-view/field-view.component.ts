import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldViewOptions } from '@class/field-type-options';
import { FormControlConfig } from '@class/reactive-form-config';

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
  @Input() config: FormControlConfig;
  @Input() field: FormControl;

}
