import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldControl } from '@class/field-control';
import { SearchParamsComponent } from '@component/search-params/search-params.component';

@Component({
  selector: 'core-search-params-dynamic',
  templateUrl: './search-params-dynamic.component.html',
  styles:[`
    .item { padding:10px;  }
  `]
})
export class SearchParamsDynamicComponent extends SearchParamsComponent {
  
  @Input() fieldsControl: FieldControl[]; //fields

  fieldsControlFilter: FieldControl[]; //fields filtrados

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

  ngOnInit() {    
    /**
     * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
     */
    this.fieldsControlFilter = this.fieldsControl.filter(fc => fc.type != 'hidden');
    super.ngOnInit();

  }

}
