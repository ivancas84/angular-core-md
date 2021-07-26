import { Component, Input } from '@angular/core';
import { FormGroupExt } from '@class/reactive-form-ext';

@Component({
  selector: 'core-search-params-dynamic',
  templateUrl: './search-params-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
  `]
})
export class SearchParamsDynamicComponent {
  
  @Input() fieldset: FormGroupExt;

}
