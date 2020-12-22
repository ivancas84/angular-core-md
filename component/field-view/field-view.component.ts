import { Component, Input} from '@angular/core';
import { FieldConfig } from '@class/field-config';

@Component({
  selector: 'core-field-view',
  templateUrl: './field-view.component.html',
})
export class FieldViewComponent {
  
  @Input() fieldConfig: FieldConfig;
  @Input() data: { [index: string]: any };
}
