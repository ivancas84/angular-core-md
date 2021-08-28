import { KeyValue } from '@angular/common';
import { Component, Input, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlComponent, FormConfig, FormControlConfig, FormGroupConfig } from '@class/reactive-form-config';

export class FieldsetDynamicConfig extends FormGroupConfig {
  componentId:string = "fieldset"
  controls: { [index: string]: FormControlConfig }
  title?: string;
  entityName?: string;
  intro?: string;
  optTitle: FormConfig[] = []; //opciones de titulo
}


@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
    .highlightText { background: yellow; }
  `]
})
export class FieldsetDynamicComponent implements ControlComponent {
  @Input() config: FormGroupConfig;
  @Input() control: FormGroup;

  sort = (a: KeyValue<string,FormControlConfig>, b: KeyValue<string,FormControlConfig>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0)
  }

}


