import { OnInit } from '@angular/core';
import { Component, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldControl } from '@class/field-control';

@Component({
  selector: 'core-field-input',
  templateUrl: './field-input.component.html',
})
export class FieldInputComponent {
  
  @Input() fieldControl: FieldControl;
  @Input() field: FormControl;
}
