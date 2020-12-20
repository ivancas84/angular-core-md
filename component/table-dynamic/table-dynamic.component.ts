import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { FieldView } from '@class/field-view';
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
  /**
   * Tabla dinamica
   */
  @Input() infoColumns: FieldView[];
  @Input() title: string; //titulo del componente
  @Input() matSortActive: string; //indicar el ordenamiento inicial
  @Input() matSortDirection: string ="asc";
     
  ngOnInit(): void {
    this.displayedColumns = [];
    for(var i in this.infoColumns) this.displayedColumns.push(this.infoColumns[i].field);

    if(!this.length) this.length = this.dataSource.length;    
    //this.footer["key"] = this.data.map(t => t["key"]).reduce((acc, value) => acc + value, 0).toFixed(2);
  }
  
}
