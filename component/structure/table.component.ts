import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FormGroupConfig } from '@class/reactive-form-config';
import { AbstractControlViewOption } from '@component/abstract-control-view/abstract-control-view.component';
import { DialogConfirmComponent } from '@component/dialog-confirm/dialog-confirm.component';
import { ArrayComponent } from '@component/structure/array.component';
import { emptyUrl } from '@function/empty-url.function';
import { getControlName } from '@function/get-control-name';
import { naturalCompare } from '@function/natural-compare';
import { titleCase } from '@function/title-case';
import { debounceTime, map } from 'rxjs/operators';

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
export class TableComponent extends ArrayComponent {
  optColumn: AbstractControlViewOption[] = []; //columna opciones
  /**
   * Columna opciones asignada a AbstractControlView
   * El "control" y el "index" se definen por cada fila, no deben ser completados
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

  showPaginator: boolean = true; //flag para visualizar el paginador
  pageSizeOptions: number[] =[10, 25, 50, 100] 
  
  footerColumns!: string[]; //columnas de footer a visualizar
  footer: FormGroup = new FormGroup({})
  footerConfig: FormGroupConfig = new FormGroupConfig 

  @ViewChild(MatPaginator) paginator?: MatPaginator; //paginacion
  @ViewChild("content", {read: ElementRef}) content!: ElementRef; //contenido para copiar o imprimir
  @ViewChild(MatTable) table!: MatTable<any>;

  
  override ngOnInit(): void {
    super.ngOnInit()
    this.initFieldset();
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
    if(this.footer && this.footerConfig) this.footerColumns = this.displayedColumns
  }


  initFieldset(){
    this.control.valueChanges.pipe(
      //startWith(this.control.value),
      debounceTime(100),
      map(
        () => {
          this.table.renderRows()
          return true;
        }
      )
    ).subscribe(
      () => {}
    );
  } 

  override switchOptField($event: { action: any; index: any; }){
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
    if((!this.length || !this.display$.value || (this.formArray).controls.length >= this.length)) {
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
    
    const data = this.formArray.value;
    
    data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {    
      return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
    });

    this.formArray.patchValue(data)
    //this.table.renderRows(); se ejecuta el renderRows del valueChanges definido en el OnInit
  }
 
  copyContent(): void {
    if(this.content) copyFormatted(this.content.nativeElement.innerHTML);
  }

  printContent(): void {
    if(this.content) printHtml(this.content.nativeElement.innerHTML);
  }

  onRemove(formControl: FormControl) { 
    /**
     * @todo Falta terminar
     * Evento de eliminacion, proporciona al usuario un dialogo de confimacion e invoca a remove para eliminar
     */
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {title: "Eliminar registro " + formControl.value, message: "Está seguro?"}
    });
 
    //var s = dialogRef.afterClosed().subscribe(result => {
      //if(result) this.remove(index)
    //});
    
    //this.subscriptions.add(s)
  }


  fg(index: number) { return this.control.controls[index]; }
  /**
   * Metodo utilizado para indicar el formGroup en el template
   */
   
  add() {
    var fg = this.config.factory!.formGroup();
    this.formArray.push(fg); 
  }
 
  remove(index: number) { 
    /**
     * Incorporar el control _mode al fieldset!
     */
    if(!this.formArray.controls[index].get("id")!.value) this.formArray.removeAt(index); 
    else this.formArray.controls[index].get("_mode")!.setValue("delete");
  }

  
  
}


  
  
