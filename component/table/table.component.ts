import { Input, Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
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
})
export abstract class TableComponent implements OnInit {

  @Input() data$: Observable<any>; 
  @Input() display$?: BehaviorSubject<Display> = new BehaviorSubject(null);
  @Input() collectionSize$?: BehaviorSubject<number> = new BehaviorSubject(null);
 
  load$: Observable<any>;
  displayedColumns: string[] = ['id', 'motivo'];
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
          return true;
        }
      )
    )
  }

  onChangePage($event: PageEvent){
    this.display$.pipe(first()).subscribe(
      display => {
        console.log(display);
        //this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
      }
    );
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
    if(this.collectionSize$ && this.display$.value && this.dataSource.length < this.collectionSize$.value){
      var display = fastClone(this.display$.value);
      display.setOrderByKeys([sort.active]);
      this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
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

