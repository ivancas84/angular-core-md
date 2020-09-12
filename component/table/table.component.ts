import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';
import { Display } from '@class/display';
import { first, map } from 'rxjs/operators';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { compare } from '@function/compare';
import { fastClone } from '@function/fast-clone';

@Component({
  selector: 'core-table',
  template: '',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export abstract class TableComponent implements OnInit {

  @Input() data$: Observable<any>; 
  @Input() display$?: BehaviorSubject<Display>;
  @Input() collectionSize$?: BehaviorSubject<number>;
 
  load$: Observable<any>;
  loadLength$: Observable<any>;

  length: number;
  displayedColumns: string[];
  dataSource: { [index: string]: any }[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Se necesita un atributo para poder aplicar ordenamiento en el cliente de los datos
   */

  progress = false;
  constructor(
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.load$ = this.data$.pipe(
      map(
        data => {
          this.dataSource = data;
          return true;
        }
      )
    )

    if(this.collectionSize$){
    this.loadLength$ = this.collectionSize$.pipe(
      map(
        length => {
          this.length = length;
          return true;
        }
      )
    )
    }
  }

  onChangePage($event: PageEvent){
    this.display$.value.setPage($event.pageIndex+1);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display$.value.encodeURI());  
  }

  serverSort(sort: Sort): boolean{
    /**
     * Ordenamiento en el servidor
     * Para que se produzca ordenamiento en el servidor se tienen que cumplir ciertas condiciones
     * @return true si se efectuo ordenamiento en el servidor
     *         false si no se efectuo ordenamiento en el servidor
     */
    if(this.length && this.display$ && this.display$.value && this.dataSource.length < this.length){
      this.display$.value.setOrderByKeys([sort.active]);
      this.display$.value.setPage(1);
      this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display$.value.encodeURI());  
      return true;
    }

    return false;
  }

  onChangeSort(sort: Sort) {
    if(this.paginator) this.paginator.pageIndex = 0;

    if(this.serverSort(sort)) return;

    const data = this.dataSource.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return compare(a[sort.active],b[sort.active], isAsc);
    });
  }
}
