import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldViewOptions } from '@class/field-view-options';
import { SearchParamsComponent } from '@component/search-params/search-params.component';

@Component({
  selector: 'core-search-params-dynamic',
  templateUrl: './search-params-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
  `]
})
export class SearchParamsDynamicComponent extends SearchParamsComponent { //2
  
  @Input() fieldsViewOptions: FieldViewOptions[]; //fields

  fieldsViewOptionsFilter: FieldViewOptions[]; //fields filtrados

  formGroup() {
    return this.fb.groupFvo(this.fieldsViewOptions);
  }

  ngOnInit() {    
    /**
     * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
     */
    this.fieldsViewOptionsFilter = this.fieldsViewOptions.filter(fc => fc.type.id != 'hidden');
    super.ngOnInit();

  }

}
