import { Input, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

declare function copyFormatted(html): any;
declare function printHtml(html): any;


@Component({
  selector: 'core-table',
  template: '',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export abstract class TableComponent implements OnInit {

  @Input() data: { [index: string]: any }[] = []; //datos recibidos
  @Input() display?: Display; //busqueda susceptible de ser modificada por ordenamiento o paginacion
  @Input() length?: number; //cantidad total de elementos, puede ser mayor que los datos a visualizar
  displayedColumns: string[]; //columnas a visualizar
  @ViewChild(MatPaginator) paginator: MatPaginator; //paginacion
  @ViewChild("content", {read: ElementRef}) content: ElementRef; //contenido para copiar o imprimir
  //footer: { [index: string]: any }[] = []; //
  dataSource:  { [index: string]: any }[] = []; //datos a visualizar
  /**
   * los datos a visualizar se separan de los datos recibidos para facilitar la reimplementacion
   */

  constructor(
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.dataSource = this.data;
    if(!this.length) this.length = this.dataSource.length;    
    //this.footer["key"] = this.data.map(t => t["key"]).reduce((acc, value) => acc + value, 0).toFixed(2);
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
    if(!this.length || !this.display || this.dataSource.length >= this.length) return false;
    this.display.setPage(1);
    this.display.setOrderByKeys([sort.active]);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());  
    return true;
  }

  onChangeSort(sort: Sort) {
    if(this.paginator) this.paginator.pageIndex = 0;

    if(this.serverSort(sort)) return;

    const data = this.dataSource.slice();

    if (!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }

    data.sort((a, b) => {    
      return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
    });

    this.dataSource = data;
  }
 
  copyContent(): void {
    if(this.content) copyFormatted(this.content.nativeElement.innerHTML);
  }

  printContent(): void {
    if(this.content) printHtml(this.content.nativeElement.innerHTML);
  }
}
