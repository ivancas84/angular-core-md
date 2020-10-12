import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, of, forkJoin, concat, merge, combineLatest } from 'rxjs';
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

  @Input() display?: Display;
  /**
   * Busqueda susceptible de ser modificada por ordenamiento o paginacion
   */
  
  @Input() collectionSize$?: Observable<number>;
  /**
   * Cantidad total de elementos, puede ser mayor que los datos a visualizar
   */

  load$: Observable<any>; 
  /**
   * atributo para suscribirme en el template e incializar
   */

  load: boolean;
  /**
   * Atributo auxiliar para visualizar la barra de progreso
   */

  //display: Display;
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
    this.load$ = combineLatest([
       this.initLength(),
       this.initData()]
    ).pipe(map(
      response => {
        this.length = response[0];
        this.dataSource = response[1];
        this.load=true;
        return true;
      }
    ));
  }

  initData(){
    this.load=false;
    return this.data$;
  }

  initLength(){
    this.load=false;

    return of({}).pipe(switchMap(() => {
      if (this.collectionSize$) return this.collectionSize$;
      return of(0);
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
