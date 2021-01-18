import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldControl } from '@class/field-control';
import { SearchParamsComponent } from '@component/search-params/search-params.component';
import { SessionStorageService } from '@service/storage/session-storage.service';

@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
  styles:[`
    .item { padding:10px;  }
  `]
})
export class SearchParamsDynamicComponent extends SearchParamsComponent {
  
  @Input() fieldsControl: FieldControl[]; //fields

  fieldsControlFilter: FieldControl[]; //fields filtrados

  constructor(
    protected fb: FormBuilder, 
    protected router: Router, 
    protected storage: SessionStorageService 
  ) {
    super(fb);
  }
  
  formGroup() {
    let fg: FormGroup = this.fb.group({});
    for(var i = 0; i < this.fieldsControl.length; i++){
      fg.addControl(
        this.fieldsControl[i].field, 
        new FormControl(null, this.fieldsControl[i].validators)
      )
    }      
    return fg;
  }

}
