import { Component, Input} from '@angular/core';
import { FieldConfig } from '@class/field-config';

@Component({
  selector: 'core-field-value',
  templateUrl: './field-value.component.html',
})
export class FieldValueComponent {
  
  @Input() value: any;
  @Input() fieldConfig: FieldConfig;

}
