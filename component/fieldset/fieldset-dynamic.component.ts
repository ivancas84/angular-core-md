import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractControlOption, FormControlConfig, FormGroupConfig } from '@class/reactive-form-config';

@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
    .highlightText { background: yellow; }
  `]
})
export class FieldsetDynamicComponent {

  /**
   * Componente para construir fieldsets dinamicos.
   */
  //@Input() config: FormGroupConfig;
  @Input() config: FormGroupConfig
  @Input() fieldset: FormGroup;
  @Input() title?: string;
  @Input() entityName?: string;
  @Input() intro?: string;
  @Input() optTitle: AbstractControlOption[] = []; //opciones de titulo

  sort = (a: KeyValue<string,FormControlConfig>, b: KeyValue<string,FormControlConfig>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0)
  }

}


