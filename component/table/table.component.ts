import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, of, forkJoin, concat, merge } from 'rxjs';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';
import { Display } from '@class/display';
import { combineAll, first, map, mergeMap, switchMap, tap } from 'rxjs/operators';
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
  /**
   * Datos que seran utilizados para visualizar o inicializar datos a mostrar
   */

  @Input() display$?: Observable<Display>;
  /**
   * Busqueda susceptible de ser modificada por ordenamiento o paginacion
   * @todo ¿es necesario que sea un Observable?
   */
  
  @Input() collectionSize$?: Observable<number>;
  /**
   * Cantidad total de elementos, puede ser mayor que los datos a visualizar
   */

  load$: Observable<any>; 
  /**
   * atributo para suscribirme en el template e incializar
   */

  display: Display;
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
    /**
     * @todo estoy dependiendo de la longitud? y si cambia data$ no se vuelve a inicializar
     * intente utilizar un forkjoin pero no me anduvo
     * conviene reemplazar display?
     */
    this.load$ = this.initLength().pipe(
      tap(length => { this.length = length }),
      mergeMap(() => { return this.display$ }),
      mergeMap(display => { 
        this.display = display;
        return this.initData() 
      }),
      map(data => {
        this.dataSource = data;
        if(!this.length) this.length = this.dataSource.length;
        return true;
      })
    );
  }

  initData(){
    return this.data$;
  }

  initLength(){
    return of({}).pipe(switchMap(() => {
      if (this.collectionSize$) return this.collectionSize$;
      return of(0);
    }));
  }

  initDisplay(){
    return of({}).pipe(switchMap(() => {
      if (this.display$) return this.display$;
      return of(null);
    }));
  }

  onChangePage($event: PageEvent){
    this.display.setPage($event.pageIndex+1);
    this.display.setSize($event.pageSize);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());  
  }

  serverSort(sort: Sort): boolean{
    /**
     * Ordenamiento en el servidor
     * Para que se produzca ordenamiento en el servidor se tienen que cumplir ciertas condiciones
     * @return true si se efectuo ordenamiento en el servidor
     *         false si no se efectuo ordenamiento en el servidor
     */
    if(this.length && this.display && this.dataSource.length < this.length){
      this.display.setPage(1);
      this.display.setOrderByKeys([sort.active]);
      //this.display$.value.setPage(1);
      this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());  
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
