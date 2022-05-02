import { Component, Input} from '@angular/core';
import { FormControlConfig } from '@class/reactive-form-config';
import { FieldWrapComponent } from '@component/field-wrap/field-wrap.component';


export class FieldWrapCardConfig extends FormControlConfig {
  override component: any = FieldWrapCardComponent
  config!: FormControlConfig
  backgroundColor?: string;
}

@Component({
  selector: 'core-field-wrap-card',
  templateUrl: './field-wrap-card.component.html',
})
export class FieldWrapCardComponent extends FieldWrapComponent {
  @Input() override config!: FieldWrapCardConfig;
 
}
