import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControlConfig } from '@class/reactive-form-config';
import { AbstractControlViewOption } from '@component/abstract-control-view/abstract-control-view.component';
import { ArrayComponent } from '@component/structure/array.component';
import { emptyUrl } from '@function/empty-url.function';
import { getControlName } from '@function/get-control-name';
import { naturalCompare } from '@function/natural-compare';
import { titleCase } from '@function/title-case';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { debounceTime, map } from 'rxjs/operators';
import { Location } from '@angular/common';

declare function copyFormatted(html: any): any;
declare function printHtml(html: any): any;

@Component({
  selector: 'core-table',
  templateUrl: './table.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableComponent extends ArrayComponent implements AfterViewInit {
  /**
   * Tabla para visualizar los datos de una entidad con ordenamiento y pagina-
   * cion
   */

  title!: string;

  optColumn: FormControlConfig[] = []; //columna opciones
  /**
   * Columna opciones asignada a AbstractControlView
   * Solo se define config, el "control" y el "index" se definen por cada fi-
   * la, no deben ser completados.
   * Recibe como control el FormGroup integro para procesar parametros
   *
   * @example boton eliminar
   * {
   *   config: new EventIconConfig({
   *     action:"remove",
   *     color: "accent",
   *     fieldEvent:this.optField,
   *     icon:"delete"
   *   }),
   * }
   */

  optFooter: AbstractControlViewOption[] = []; //columna opciones
  optTitle: AbstractControlViewOption[] = []; //opciones titulo

  serverSortTranslate: { [index: string]: string[] } = {};
  /**
   * traduccion de campos de ordenamiento
   * 
   * @example {"nombre":["per-apellidos","per-nombres"], "departamento_judicial":["per_dj-codigo"]}
   */
  serverSortObligatory: string[] = []; //
   /**
    * Ordenamiento obligatorio en el servidor
    * 
    * Ciertos campos que son utilizados en subcomponentes y traducidos a otros valores puede ser necesario ordenarlos siempre en el servidor
    * Si se ordenan en el cliente, no se proporcionara un ordenamiento correcto
    * Es utilizado por ejemplo para las claves foraneas que se muestran a traves del componente "label". El valor original es un id, si se ordena por el id puede no proporcional el valor deseado
    * Si un campo se incluye en serverSortObligatory, casi con seguridad estara tambien incluido su valor en serverSortTranslate
    */

  displayedColumns!: string[]; //columnas a visualizar
  /**
   * Si no esta definido se completa en funcion de this.config
   */

  sortActive: string = "";
  sortDirection: SortDirection = "asc";
  sortDisabled: string[]= []; //campos a los que se deshabilita el ordenamiento

  pageSizeOptions: number[] =[10, 25, 50, 100] 
  
  footerColumns?: string[]; //columnas de footer a visualizar


  @ViewChild(MatPaginator) paginator?: MatPaginator; //paginacion
  @ViewChild("mainTable") content!: ElementRef; //contenido para copiar o imprimir
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    protected override dd: DataDefinitionToolService, 
    protected override storage: SessionStorageService,
    protected override dialog: MatDialog,
    protected override snackBar: MatSnackBar,
    protected override router: Router, 
    protected override route: ActivatedRoute, 
    protected override location: Location, 
    protected cd:ChangeDetectorRef 
  ) {
    super(dd, storage, dialog, snackBar, router, route, location)
  }

  ngAfterViewInit(): void {
    this.renderRows()
  }

  override ngOnInit(): void {
    if(!this.title) this.title = titleCase(this.entityName.replace("_"," "))
    super.ngOnInit()
    this.initDisplayedColumns();
  }

  initDisplayedColumns(){
    this.displayedColumns = []
    var fg = this.config.factory!.formGroup();
    /**
     * Se crea una instancia de formGroup para definir el label
     */
    Object.keys(this.config.controls).forEach(key => {
      if(this.config.controls[key].component) this.displayedColumns.push(key);
      if(!this.config.controls[key].label) {
        var n = getControlName(fg.controls[key])
        this.config.controls[key].label = titleCase(n.substring(n.indexOf("-")+1).replace("_"," "))
      }
    })
    if(this.optColumn.length) this.displayedColumns.push("options");
    if(this.footerConfig) this.footerColumns = this.displayedColumns
  }
  
  renderRows(){
    var s = this.control.valueChanges.pipe(
      //startWith(this.control.value),
      debounceTime(100),
      map(
        () => {
          if(this.table) this.table.renderRows()
        }
      )
    ).subscribe(
      () => {}
    );
    this.subscriptions.add(s)
  } 

  override switchOptField($event:{ action: any; index?: any; control?: AbstractControl}){
    switch($event.action){
      case "remove": this.remove($event.index); break;
      case "copy_content": this.copyContent(); break;
      case "print_content": this.printContent(); break;
      case "add": this.add(); break;
      default: super.switchOptField($event);
    }
  }

  onChangePage($event: PageEvent){
    var display = this.display$.value;
    display.setPage($event.pageIndex+1);
    display.setSize($event.pageSize);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
  }

  serverSort(sort: Sort): boolean{ 
    if((!this.length || !this.display$.value || (this.control).controls.length >= this.length)) {
      if(!this.serverSortObligatory.includes(sort.active)) return false;
    }

    var display = this.display$.value;

    display.setOrderByKeys(
      this.serverSortTranslate.hasOwnProperty(sort.active) ? this.serverSortTranslate[sort.active] : [sort.active]
    )
    display.setPage(1)
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
    return true;
  }

  onChangeSort(sort: Sort) {
    if(this.paginator) this.paginator.pageIndex = 0;

    if(this.serverSort(sort)) return;

    if (!sort.active || sort.direction === '') return;
    
    const data = this.control.value;
    
    data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {    
      return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
    });

    this.control.patchValue(data)
    //this.table.renderRows(); se ejecuta el renderRows del valueChanges definido en el OnInit
  }
 
  copyContent(): void {
    if(this.content) {
      var index = this.displayedColumns.indexOf("options");
      if (index !== -1) {
        this.displayedColumns.splice(index, 1);
        this.cd.detectChanges()
      }
      copyFormatted(this.content.nativeElement.innerHTML);
      if (index !== -1) this.displayedColumns.splice(index, 0, "options");
    }
  }

  printContent(): void {
    if(this.content) {
      var index = this.displayedColumns.indexOf("options");
      if (index !== -1) {
        this.displayedColumns.splice(index, 1);
        this.cd.detectChanges()
      }
      printHtml(this.content.nativeElement.innerHTML);
      if (index !== -1) this.displayedColumns.splice(index, 0, "options");
    }
  }

  override setData(data: any[]){
    super.setData(data);
  }

}


  
  
