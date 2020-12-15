import { Component, Input} from '@angular/core';

@Component({
  selector: 'core-field-value',
  templateUrl: './field-value.component.html',
})
export class FieldValueComponent {
  
  @Input() type: string;  
  @Input() value: any;
  @Input() format?: string;
}
