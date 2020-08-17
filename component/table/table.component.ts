import { Input, Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';
import { Display } from '@class/display';
import { first, map } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
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
  /**
   * Se necesita un atributo para poder aplicar ordenamiento en el cliente de los datos
   */

  constructor(
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.load$ = this.data$.pipe(
      map(
        data => {
          this.dataSource = data;
          return this.dataSource;
        }
      )
    )

    //No se por que no funciona utilizar collectionSize directamente, 
    //en la paginacion me da que es undefined
    this.loadLength$ = this.collectionSize$.pipe(
      map(
        length => {
          this.length = length;
          return this.length;
        }
      )
    )

  }

  onChangePage($event: PageEvent){
    this.display$.value.setPage($event.pageIndex+1);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display$.value.encodeURI());  
  }

  order(params: Array<string>): void {
    /**
     * Transformar valores de ordenamiento del atributo display
     */
    this.display$.pipe(first()).subscribe(
      display => {
        display.setOrderByKeys(params);
        this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
      }
    );
  }

  onChangeSort(sort: Sort) {
    if(this.length && this.display$.value && this.dataSource.length < this.length){
      this.display$.value.setOrderByKeys([sort.active]);
      this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display$.value.encodeURI());  
      return;
    }

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
