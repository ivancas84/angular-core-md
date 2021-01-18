import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { FieldConfig } from '@class/field-config';
import { TableDynamicOptions } from '@class/table-dynamic-options';
import { TableComponent } from '@component/table/table.component';

@Component({
  selector: 'core-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableDynamicComponent extends TableComponent implements OnInit {
  @Input() fieldsConfig: FieldConfig[]
  @Input() title: string //titulo del componente
  @Input() options: any = {}
  opt: TableDynamicOptions;
     
  ngOnInit(): void {
    this.displayedColumns = []
    this.opt = new TableDynamicOptions(this.options);
    for(var i in this.fieldsConfig) this.displayedColumns.push(this.fieldsConfig[i].field)

    super.ngOnInit();
  }
  
}
