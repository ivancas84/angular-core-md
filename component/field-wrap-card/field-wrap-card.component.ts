import { Component, Input, OnInit} from '@angular/core';
import { FormControlConfig } from '@class/reactive-form-config';
import { FieldWrapComponent } from '@component/field-wrap/field-wrap.component';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';

export class FieldWrapCardConfig extends FormControlConfig {
  override component: any = FieldWrapCardComponent
  config!: FormControlConfig
  backgroundColor?: string;
}

@Component({
  selector: 'core-field-wrap-card',
  templateUrl: './field-wrap-card.component.html',
})
export class FieldWrapCardComponent extends FieldWrapComponent implements OnInit {

  @Input() override config: FieldWrapCardConfig | {[key:string]: any} = {};

  ngOnInit(): void {
    if(!this.config.hasOwnProperty("component")) this.config = new FieldWrapCardConfig(this.config)

    var n = getControlName(this.control)
    this.config.label = titleCase(n!.substring(n!.indexOf("-")+1).replace("_"," "))
  }
 
}
