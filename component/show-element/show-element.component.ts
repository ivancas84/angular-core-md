import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';
import { Display } from '@class/display';
import { first } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { compare } from '@function/compare';

@Component({
  selector: 'app-admin',
  template: '',
})
export abstract class ShowElementComponent  {

  @Input() data$: Observable<any>; 
  /**
   * datos principales
   */

  @Input() display$?: BehaviorSubject<Display> = new BehaviorSubject(null);

  @Input() collectionSize$?: BehaviorSubject<number> = new BehaviorSubject(null);
 
  dataSource  = [];

  constructor(
    protected router: Router,
  ) {}

  
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

