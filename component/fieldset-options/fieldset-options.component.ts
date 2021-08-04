import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGroupConfig } from '@class/reactive-form-config';

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
  
}
