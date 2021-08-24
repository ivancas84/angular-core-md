import { Component, Input, OnChanges, OnInit, SimpleChanges, Type} from '@angular/core';
import { FormConfig } from '@class/reactive-form-config';
import { FieldWrapComponent } from '@component/field-wrap/field-wrap.component';


export class FieldWrapCardConfig extends FormConfig {
  componentId: string = "wrap_card"
  config: FormConfig
  backgroundColor?: string;
}

@Component({
  selector: 'core-field-wrap-card',
  templateUrl: './field-wrap-card.component.html',
})
export class FieldWrapCardComponent extends FieldWrapComponent {
  @Input() config: FieldWrapCardConfig;
 
}
