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
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

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
export abstract class TableComponent implements OnInit { //2
  /**
   * Elementos de uso habitual para una tabla
   * Versión 1
   */
  @Input() dataSource: { [index: string]: any }[] = []; //datos recibidos que seran visualizados
  @Input() display?: Display; //busqueda susceptible de ser modificada por ordenamiento o paginacion
  @Input() length?: number; //cantidad total de elementos, puede ser mayor que los datos a visualizar
  displayedColumns: string[]; //columnas a visualizar
  @ViewChild(MatPaginator) paginator: MatPaginator; //paginacion
  @ViewChild("content", {read: ElementRef}) content: ElementRef; //contenido para copiar o imprimir
  //footer: { [index: string]: any }[] = []; //

  /**
   * los datos a visualizar se separan de los datos recibidos para facilitar la reimplementacion
   * si no se define display o length no se muestra la paginacion
   */

  entityName?: string;
  titleLoad$: Observable<string[]>;

  constructor(
    protected router: Router,
    protected dd: DataDefinitionService
  ) {}

  ngOnInit(): void {
    var p = Object.keys(this.display.getParams());
    if(p.length == 1 && this.entityName){
      if(p[0].includes("-")) {
        this.titleLoad$ = this.dd.post("rel",this.entityName).pipe(
          map(
            response => {
              var r = response[
                p[0].substring(0,p[0].indexOf("-"))
              ];
              r["value"] = this.display.getParams()[p[0]];
              return r;
            }
          )
        )  
      }
    }
    
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
