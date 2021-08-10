import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { FieldWrapComponent } from '@component/field-wrap/field-wrap.component';

@Component({
  selector: 'core-field-wrap-card',
  templateUrl: './field-wrap-card.component.html',
})
export class FieldWrapCardComponent extends FieldWrapComponent{
 
  @Input() backgroundColor?: string;

}
