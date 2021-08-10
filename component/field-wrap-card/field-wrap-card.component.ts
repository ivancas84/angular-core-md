import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';

@Component({
  selector: 'core-field-wrap-card',
  templateUrl: './field-wrap-card.component.html',
})
export class FieldWrapCardComponent implements OnInit {
  ngOnInit(): void {
console.log(this.backgroundColor)  }
  
  @Input() field: FormControl;
  @Input() config: FormControlConfig;
  @Input() backgroundColor?: string;

}
