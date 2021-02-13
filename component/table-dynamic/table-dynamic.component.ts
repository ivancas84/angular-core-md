import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { FieldViewOptions } from '@component/field-view/field-view.component';
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
  @Input() fieldsViewOptions: FieldViewOptions[]
  @Input() title: string //titulo del componente
  @Input() options: TableDynamicOptions = new TableDynamicOptions()
     
  ngOnInit(): void {
    this.displayedColumns = []
    for(var i in this.fieldsViewOptions) this.displayedColumns.push(this.fieldsViewOptions[i].field)

    super.ngOnInit();
  }
  
}
