import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldViewOptions } from '@class/field-view-options';
import { FieldsetDynamicOptions } from '@class/fieldset-dynamic-options';
import { FieldsetArrayComponent } from '@component/fieldset-array/fieldset-array.component';
import { arrayColumn } from '@function/array-column';
import { arrayCombine } from '@function/array-combine';
import { SessionStorageService } from '@service/storage/session-storage.service';

@Component({
  selector: 'core-fieldset-array-dynamic',
  templateUrl: './fieldset-array-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
  `]
})
export class FieldsetArrayDynamicComponent extends FieldsetArrayComponent {
  /**
   * Componente dinamico de administración de fieldset array
   * La estructura por defecto del componente de implementacion
   * es la misma que para FieldsetDynamicComponent,
   * simplemente se debe cambiar la superclase
   **/

  @Input() fieldsViewOptions: FieldViewOptions[]; //fields
  @Input() title: string; //titulo del componente
  @Input() options: FieldsetDynamicOptions = new FieldsetDynamicOptions()

  fieldsViewOptionsFilter: FieldViewOptions[]; //fields filtrados

  constructor(
    protected fb: FormBuilder, 
    protected router: Router, 
    protected storage: SessionStorageService 
  ) {
    super(router, storage);
  }
  
  formGroup() {
    let fg: FormGroup = this.fb.group({});
    for(var i = 0; i < this.fieldsViewOptions.length; i++){
      fg.addControl(
        this.fieldsViewOptions[i].field, 
        new FormControl(
          {
            value:null,
            disabled:this.fieldsViewOptions[i].control.disabled
          }, 
          {
            validators:this.fieldsViewOptions[i].control.validators,
            asyncValidators:this.fieldsViewOptions[i].control.asyncValidators,
          })
      )
      fg.addControl("_delete",new FormControl(null))
      
    }      
    return fg;
  }

  _delete(index: number) { return this.fieldset.at(index).get('_delete')}


  ngOnInit() {    
    this.fieldsViewOptionsFilter = this.fieldsViewOptions.filter(fc => fc.type.id != 'hidden');
    this.defaultValues = arrayCombine(arrayColumn(this.fieldsViewOptions,"field"),arrayColumn(this.fieldsViewOptions,"default"));
    super.ngOnInit();
  }
}
