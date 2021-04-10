import { Input, Component, OnInit } from '@angular/core';
import { FieldViewOptions } from '@class/field-view-options';
import { TableComponent } from '@component/table/table.component';

@Component({
  selector: 'core-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableDynamicComponent extends TableComponent implements OnInit { //3
  @Input() fieldsViewOptions: FieldViewOptions[]
  @Input() title: string //titulo del componente
  @Input() addButtonLink: string = null;
  @Input() addButtonQueryParams: { [index: string]: any } = {};
  @Input() copyButton: boolean = true;
  @Input() printButton: boolean = true;
  @Input() sortActive: string = null;
  @Input() sortDirection: string = "asc";
  @Input() options: any = null; //columna opciones
  /**
   * Si es null no se visualiza
   * {path, label, params, icon, data}
   */

  
     
  ngOnInit(): void {
    this.displayedColumns = []
    for(var i in this.fieldsViewOptions) this.displayedColumns.push(this.fieldsViewOptions[i].field)

    super.ngOnInit();
  }
  
}
