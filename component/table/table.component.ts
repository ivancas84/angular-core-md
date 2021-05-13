import { Input, Component, OnInit, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';
import { Display } from '@class/display';
import { map } from 'rxjs/operators';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { naturalCompare } from '@function/natural-compare';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '@component/dialog-confirm/dialog-confirm.component';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '@service/storage/session-storage.service';

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
export abstract class TableComponent implements OnInit, OnChanges { //3
  /**
   * Elementos de uso habitual para una tabla
   */
  @Input() dataSource: { [index: string]: any }[] = []; //datos recibidos que seran visualizados
  @Input() display?: Display; //busqueda susceptible de ser modificada por ordenamiento o paginacion
  @Input() length?: number; //cantidad total de elementos, puede ser mayor que los datos a visualizar
  displayedColumns: string[]; //columnas a visualizar
  @ViewChild(MatPaginator) paginator: MatPaginator; //paginacion
  @ViewChild("content", {read: ElementRef}) content: ElementRef; //contenido para copiar o imprimir
  //footer: { [index: string]: any }[] = []; //
  protected subscriptions = new Subscription(); //suscripciones en el ts

  /**
   * los datos a visualizar se separan de los datos recibidos para facilitar la reimplementacion
   * si no se define display o length no se muestra la paginacion
   */

  entityName?: string;
  titleLoad$: Observable<string[]>;
  deleteApi: string = "delete";

  constructor(
    protected router: Router,
    protected dd: DataDefinitionService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected storage: SessionStorageService
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

  ngOnChanges(changes: SimpleChanges): void {
    if( changes['dataSource'] && changes['dataSource'].previousValue != changes['dataSource'].currentValue ) {    
      if(!this.length) this.length = this.dataSource.length;    
    }
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

  onRemove(index) { 
    /**
     * Evento de eliminacion, proporciona al usuario un dialogo de confimacion e invoca a remove para eliminar
     */
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {title: "Eliminar registro " + index, message: "Está seguro?"}
    });
 
    var s = dialogRef.afterClosed().subscribe(result => {
      if(result) this.remove(index)
    });
    
    this.subscriptions.add(s)
  }

  remove(index: number) {
    /**
     * Acción de eliminación
     */
    var s = this.delete(index).subscribe(
      response => {
        this.deleted(index, response)        
      },
      error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
      }
    );
    this.subscriptions.add(s);
  }

  delete(index: number): Observable<any> {
    /**
     * Invocar api de eliminación indicda en atributo deleteApi
     */
    return this.dd.post(this.deleteApi, this.entityName, [this.dataSource[index]["id"]])
  }

  deleted(index, response){
    /**
     * Acciones una vez realizada la eliminación
     */
    const data = this.dataSource.slice()
    data.splice(index, 1)
    this.snackBar.open("Registro eliminado", "X")
    this.removeStorage(response)
    this.dataSource = data
    this.length--
  }

  removeStorage(response){
    this.storage.removeItemsContains(".");
    this.storage.removeItemsPersisted(response["detail"]);
  }

}
