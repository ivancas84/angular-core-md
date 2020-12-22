import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldConfig } from '@class/field-config';
import { FieldControl } from '@class/field-control';
import { FieldsetComponent } from '@component/fieldset/fieldset.component';
import { arrayColumn } from '@function/array-column';
import { arrayCombine } from '@function/array-combine';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { ValidatorsService } from '@service/validators/validators.service';

@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
})
export class FieldsetDynamicComponent extends FieldsetComponent {
  
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() fieldsControl: FieldControl[]; //fields
  @Input() title: string; //titulo del componente

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
    
    this.defaultValues = arrayCombine(arrayColumn(this.fieldsControl,"field"),arrayColumn(this.fieldsControl,"field"));
    super.ngOnInit();

  }
}
