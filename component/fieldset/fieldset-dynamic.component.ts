import { Component, Input } from '@angular/core';
import { FormGroupExt } from '@class/reactive-form-ext';

@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
    .highlightText { background: yellow; }
  `]
})
export class FieldsetDynamicComponent  { 
  
  /**
   * Componente para construir fieldsets dinamicos.
   */
  @Input() fieldset: FormGroupExt;
  @Input() title?: string;
  @Input() inputSearchGo: boolean = false;
  @Input() entityName?: string;
  @Input() intro?: string;

}
