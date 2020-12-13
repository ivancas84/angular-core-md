import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { compare } from '@function/compare';
import { MatTableDataSource, MatTable } from '@angular/material/table';

@Component({
  selector: 'core-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableDynamicComponent implements OnInit {

  @Input() data$: Observable<any>; 
  @Input() displayedColumns: { [index: string]: any }[];
  /**
   * name: "nombre del field"
   * type: "tipo del field"
   * options: "dependiendo del tipo, puede recibir opciones adicionales"
   * ejemplo: {name:"fecha",type:"datetime","options":{format:"mediumDate",timezone:"undefined",locale:"undefined"}}
   */ 
  @Input() title: string = "";
 
  load$: Observable<any>;

  dataSource = new MatTableDataSource<{ [index: string]: any }>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  /**
   * Se necesita un atributo para poder aplicar ordenamiento en el cliente de los datos
   */

  progress = false;
  constructor(
    protected router: Router,
  ) {}

  ngOnInit(): void {
     this.data$.subscribe(
        data => {
          this.dataSource.data = data;
          //this.table.renderRows();
          return true;
        }
      )
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
