import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGroupConfig, SortControl } from '@class/reactive-form-config';

@Component({
  selector: 'core-fieldset-options',
  templateUrl: './fieldset-options.component.html',
  styles:[`
    .item { padding:0px 10px;  }
    .highlightText { background: yellow; }
  `]
})
export class FieldsetOptionsComponent {
  /**
   * Componente para construir fieldsets dinamicos.
   */
  @Input() config: FormGroupConfig;
  @Input() fieldset: FormGroup;

  sort = (a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0)
  }
  
}
