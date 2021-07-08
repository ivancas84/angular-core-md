import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldViewOptions } from '@class/field-view-options';
import { FieldsetDynamicOptions } from '@class/fieldset-dynamic-options';
import { UniqueValidatorOpt, ValidatorOpt } from '@class/validator-opt';
import { FieldsetComponent } from '@component/fieldset/fieldset.component';
import { arrayColumn } from '@function/array-column';
import { arrayCombine } from '@function/array-combine';
import { SessionStorageService } from '@service/storage/session-storage.service';

@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
    .highlightText { background: yellow; }
  `]
})
export class FieldsetDynamicComponent extends FieldsetComponent { //3
  
  /**
   * Componente de administración de fieldset.
   * El formulario y los datos son definidos en componente principal  
   */

  @Input() fieldsViewOptions: FieldViewOptions[] //opciones de campos
  @Input() title: string //titulo del componente
  @Input() inputSearchGo: boolean = true
  @Input() validatorOpts?: ValidatorOpt[] = []//validators para el fieldset
  @Input() intro?: string //parrafo de introduccion

  //@Input() asyncValidators?: UniqueValidatorOpt[] //asyncValidators para el fieldset

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
    
    var v = [];
    for(var i = 0; i < this.validatorOpts.length; i++) v.push(this.validatorOpts[i].fn)
    fg.setValidators(v);


    return fg;
  }

  ngOnInit() { 
    this.fieldsViewOptions.forEach(fc =>  this.defaultValues[fc["field"]] = fc["control"]["default"] );
    this.fieldsViewOptionsFilter = this.fieldsViewOptions.filter(fc => fc.type.id != 'hidden');
    super.ngOnInit();

  }
}
