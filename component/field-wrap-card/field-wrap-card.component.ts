import { Component, Input} from '@angular/core';
import { FormConfig } from '@class/reactive-form-config';
import { FieldWrapComponent } from '@component/field-wrap/field-wrap.component';


export class FieldWrapCardConfig extends FormConfig {
  override component: any = FieldWrapCardComponent
  config!: FormConfig
  backgroundColor?: string;
}

@Component({
  selector: 'core-field-wrap-card',
  templateUrl: './field-wrap-card.component.html',
})
export class FieldWrapCardComponent extends FieldWrapComponent {
  @Input() override config!: FieldWrapCardConfig;
 
}
