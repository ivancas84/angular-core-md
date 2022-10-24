import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { emptyUrl } from '@function/empty-url.function';
import { TableSimpleComponent } from './table-simple.component';

@Component({
  selector: 'core-table-paginator',
  template: '',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export abstract class TablePaginatorComponent extends TableSimpleComponent {
  @ViewChild(MatPaginator) paginator?: MatPaginator; //paginacion

  pageSizeOptions: number[] =[10, 25, 50, 100] 

  onChangePage($event: PageEvent){
    var display = this.display$.value;
    display.setPage($event.pageIndex+1);
    display.setSize($event.pageSize);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
  }
}



  
  
