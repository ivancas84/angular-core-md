import { FormBuilder, FormGroup } from '@angular/forms';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SearchParamsComponent } from '@component/search-params/search-params.component';
import { Component } from '@angular/core';
import { FormBuilderService } from '@service/form-builder/form-builder.service';

@Component({
  selector: 'core-search-all',
  templateUrl: './search-all.component.html',
})
export class SearchAllComponent extends SearchParamsComponent {
  
  constructor (
    protected fb: FormBuilderService, 
    protected dd: DataDefinitionService
  ) { super(fb); }


  formGroup(): FormGroup {
    let fg: FormGroup = this.fb.group({
      _search: null
    });
    return fg;
  }
  
}
