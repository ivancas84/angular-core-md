import { Input, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldViewOptions } from '@class/field-view-options';
import { TableDynamicOptions } from '@class/table-dynamic-options';
import { TableAdminComponent } from '@component/table-admin/table-admin.component';
import { arrayColumn } from '@function/array-column';
import { arrayCombine } from '@function/array-combine';

@Component({
  selector: 'core-table-admin-dynamic',
  templateUrl: './table-admin-dynamic.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableAdminDynamicComponent extends TableAdminComponent implements OnInit {
  /**
   * Grilla de visualizacion y administracion dinamica
   * 
   * Version 1
   * Compatible con TableAdminComponent 1.x
   * Copia caracteristicas de FieldsetDynamicComponent 1.x
   */
  
  @Input() entityName: string; //entidad principals
  @Input() fieldsViewOptions: FieldViewOptions[]
  @Input() title: string //titulo del componente
  
  fieldsViewOptionsFilter: FieldViewOptions[]; //filtro de opciones de campos
  /**
   * Es necesario filtrar los campos con opciones particulares, 
   * por ejemplo "hidden" para no incluirlas en el template
   */

  ngOnInit(): void {
    this.defaultValues = arrayCombine(arrayColumn(this.fieldsViewOptions,"field"),arrayColumn(this.fieldsViewOptions,"default"));
    this.fieldsViewOptionsFilter = this.fieldsViewOptions.filter(fc => fc.type.id != 'hidden');
    super.ngOnInit();
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
 
}
