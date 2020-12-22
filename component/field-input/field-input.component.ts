import { OnInit } from '@angular/core';
import { Component, Input} from '@angular/core';
import { FieldConfig } from '@class/field-config';
import { FieldControl } from '@class/field-control';

@Component({
  selector: 'core-field-input',
  templateUrl: './field-input.component.html',
})
export class FieldInputComponent {
  
  
  @Input() fieldControl: FieldControl;
  @Input() field: { [index: string]: any };
}
