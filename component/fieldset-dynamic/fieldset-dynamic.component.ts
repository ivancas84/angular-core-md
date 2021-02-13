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
export class FieldsetDynamicComponent extends FieldsetComponent {
  
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

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
            disabled:this.fieldsViewOptions[i].disabled
          }, 
          {
            validators:this.fieldsViewOptions[i].validators,
            asyncValidators:this.fieldsViewOptions[i].asyncValidators,
          }
        )
      )
    }      
    return fg;
  }

  ngOnInit() {    
    /**
     * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
     */
    this.fieldsViewOptionsFilter = this.fieldsViewOptions.filter(fc => fc.type != 'hidden');
    this.defaultValues = arrayCombine(arrayColumn(this.fieldsViewOptions,"field"),arrayColumn(this.fieldsViewOptions,"default"));
    super.ngOnInit();

  }
}
