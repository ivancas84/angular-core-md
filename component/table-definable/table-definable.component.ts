import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TableComponent } from '@component/table/table.component';

@Component({
  selector: 'core-table-definable',
  template: '',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export abstract class TableDefinableComponent extends TableComponent implements OnChanges, OnInit {
  /**
   * Tiene el mismo comportamiento que el Table pero con codigo adicional para facilitar la reimplementacion de datos en caso de que sea necesario
   * Este componente no deberia ser utilizado, los datos deberian definirse en un componente padre se deja como referencia
   */
  @Input() data: { [index: string]: any }[] = []; //datos recibidos
  load$: Observable<any>;
  load: boolean;
  data$: BehaviorSubject<any> = new BehaviorSubject(null);

  
  ngOnChanges(changes: SimpleChanges): void {
    if( changes['data'] && changes['data'].previousValue != changes['data'].currentValue ) {  
      this.data$.next(changes['data'].currentValue);
    }
  }

  ngOnInit(): void {  
    this.load$ = this.data$.pipe(  
      switchMap(
        data => {
          this.load = false;
          return this.initData(data);
        }
      ),
      map(
        data => {
          this.dataSource = data;
          return this.load = true;
        }
      )
    )
  }

  initData(data): Observable<{ [index: string]: any }[]>{
    return of(data);
  }


}
