import { OnInit } from '@angular/core';
import { Component, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldViewOptions } from '@component/field-view/field-view.component';

@Component({
  selector: 'core-field-input',
  templateUrl: './field-input.component.html',
})
export class FieldInputComponent {
  
  @Input() fieldViewOptions: FieldViewOptions;
  @Input() field: FormControl;
}
