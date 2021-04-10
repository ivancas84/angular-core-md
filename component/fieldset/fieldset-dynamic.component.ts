import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldViewOptions } from '@class/field-view-options';
import { FieldsetDynamicOptions } from '@class/fieldset-dynamic-options';
import { FieldsetComponent } from '@component/fieldset/fieldset.component';
import { arrayColumn } from '@function/array-column';
import { arrayCombine } from '@function/array-combine';
import { SessionStorageService } from '@service/storage/session-storage.service';

@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
  `]
})
export class FieldsetDynamicComponent extends FieldsetComponent { //3
  
  /**
   * Componente de administración de fieldset.
   * El formulario y los datos son definidos en componente principal  
   */

  @Input() fieldsViewOptions: FieldViewOptions[]; //opciones de campos
  @Input() title: string; //titulo del componente
  @Input() inputSearchGo: boolean = true;

  fieldsViewOptionsFilter: FieldViewOptions[]; //filtro de opciones de campos
  /**
   * Es necesario filtrar los campos con opciones particulares, por ejemplo "hidden" 
   * para no incluirlas en el template
   */

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
          }
        )
      )
    }      
    return fg;
  }

  ngOnInit() {    
    this.defaultValues = arrayCombine(arrayColumn(this.fieldsViewOptions,"field"),arrayColumn(this.fieldsViewOptions,"default"));
    this.fieldsViewOptionsFilter = this.fieldsViewOptions.filter(fc => fc.type.id != 'hidden');
    super.ngOnInit();

  }
}
