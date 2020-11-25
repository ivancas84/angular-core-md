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
import { naturalCompare } from '@function/natural-compare';

@Component({
  selector: 'core-table',
  template: '',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export abstract class TableComponent implements OnInit {

  @Input() data: { [index: string]: any }[] = []; 
  /**
   * Datos que seran utilizados para visualizar o inicializar datos a mostrar
   * Conviene que sea un observable para facilitar el encadenamiento con otro Observable
   * Se puede encadenar con otro observable para redefinir los datos
   * Los datos a visualizar resultantes seran cargados en el atributo "displayedColumns"
   */

  @Input() display?: Display;
  /**
   * Busqueda susceptible de ser modificada por ordenamiento o paginacion
   */
  
  @Input() length?: number;
  /**
   * Cantidad total de elementos, puede ser mayor que los datos a visualizar
   */

  
  displayedColumns: string[];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  progress = false;
  
  constructor(
    protected router: Router,
  ) {}

  
  ngOnInit(): void {
    if(!this.length) this.length = this.data.length;    
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
    if(this.length && this.display && this.data.length < this.length){
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

    const data = this.data.slice();

    if (!sort.active || sort.direction === '') {
      this.data = data;
      return;
    }

    data.sort((a, b) => {    
      return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
    });

    this.data = data;
  }
}
