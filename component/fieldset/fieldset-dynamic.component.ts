import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGroupConfig } from '@class/reactive-form-config';

@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
    .highlightText { background: yellow; }
  `]
})
export class FieldsetDynamicComponent  implements OnInit {
  ngOnInit(): void {
  } 
  
  /**
   * Componente para construir fieldsets dinamicos.
   */
  @Input() config: FormGroupConfig;
  @Input() fieldset: FormGroup;
  @Input() title?: string;
  @Input() inputSearchGo: boolean = false;
  @Input() entityName?: string;
  @Input() intro?: string;

}
