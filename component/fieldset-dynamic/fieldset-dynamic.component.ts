import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldControl } from '@class/field-control';
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

  @Input() fieldsControl: FieldControl[]; //fields
  @Input() title: string; //titulo del componente
  @Input() options: FieldsetDynamicOptions = new FieldsetDynamicOptions()

  fieldsControlFilter: FieldControl[]; //fields filtrados

  constructor(
    protected fb: FormBuilder, 
    protected router: Router, 
    protected storage: SessionStorageService 
  ) {
    super(router, storage);
  }
  
  formGroup() {
    let fg: FormGroup = this.fb.group({});
    for(var i = 0; i < this.fieldsControl.length; i++){
      fg.addControl(
        this.fieldsControl[i].field, 
        new FormControl(
          {
            value:null,
            disabled:this.fieldsControl[i].disabled
          }, 
          {
            validators:this.fieldsControl[i].validators,
            asyncValidators:this.fieldsControl[i].asyncValidators,
          })
      )
    }      
    return fg;
  }

  ngOnInit() {    
    /**
     * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
     */
    this.fieldsControlFilter = this.fieldsControl.filter(fc => fc.type != 'hidden');
    this.defaultValues = arrayCombine(arrayColumn(this.fieldsControl,"field"),arrayColumn(this.fieldsControl,"default"));
    super.ngOnInit();

  }
}
