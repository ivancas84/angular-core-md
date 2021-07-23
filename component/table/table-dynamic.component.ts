import { Input, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { FieldViewOptions } from '@class/field-view-options';
import { TableComponent } from '@component/table/table.component';
import { emptyUrl } from '@function/empty-url.function';

@Component({
  selector: 'core-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableDynamicComponent extends TableComponent implements OnInit { //6
  @Input() entityName?: string;
  @Input() fieldsViewOptions: FieldViewOptions[]
  @Input() title: string //titulo del componente
  @Input() addButtonLink: string = null;
  @Input() addButtonQueryParams: { [index: string]: any } = {};
  @Input() copyButton: boolean = true;
  @Input() printButton: boolean = true;
  @Input() sortActive: string = null;
  @Input() sortDirection: string = "asc";
  @Input() sortDisabled: string[]= []; //campos a los que se deshabilita el ordenamiento
  @Input() optColumn: any[] = null; //columna opciones (si es null no se visualiza)
  /**
   * Cada elemento debe ser uno de los siguientes OptRouteIcon | OptLinkIcon | OptRouteText | OptLinkText
   */

  @Output() eventTable: EventEmitter<any> = new EventEmitter();
     
  ngOnInit(): void {
    this.displayedColumns = []
    for(var i in this.fieldsViewOptions) this.displayedColumns.push(this.fieldsViewOptions[i].field)
    if(this.optColumn) this.displayedColumns.push("options");
    super.ngOnInit();
  }

  emitEventTable($event){
    switch($event.action){
      case "table_delete":
        this.onRemove($event.index);
      break;
      default:
        this.eventTable.emit($event);
    }
  }

  

  
  
}
