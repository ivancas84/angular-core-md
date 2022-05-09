import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FormArrayConfig, FormControlConfig, FormGroupConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';
import { naturalCompare } from '@function/natural-compare';
import { titleCase } from '@function/title-case';
import { debounceTime, map } from 'rxjs';

declare function copyFormatted(html: any): any;
declare function printHtml(html: any): any;

@Component({
  selector: 'core-table-one',
  templateUrl: './table-one.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableOneComponent implements OnInit {
  /**
   * Tabla independiente con las opciones generales
   * Esta clase facilita la implementacion de una tabla, pero no se recomienda
   * su uso.
   * Utilizar para un conjunto de datos completo que no requieran paginacion.
   */

  @Input() control!: FormArray;
   /**
    * Referencia directa del FormArray que formara parte del control
    */
   
  @Input() config!: FormArrayConfig

  @Input() displayedColumns: string[] = []; //columnas a visualizar

  @Input() optColumn: FormControlConfig[] = []; //columna opciones
  /**
   * Columna opciones asignada a AbstractControlView
   * Solo se define config, el "control" y el "index" se definen por cada fi'
   * la, no deben ser completados.
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

  @Input() serverSortTranslate: { [index: string]: string[] } = {};
   /**
    * traduccion de campos de ordenamiento
    * 
    * @example {"nombre":["per-apellidos","per-nombres"], "departamento_judicial":["per_dj-codigo"]}
    */
  @Input() serverSortObligatory: string[] = []; //
    /**
     * Ordenamiento obligatorio en el servidor
     * 
     * Ciertos campos que son utilizados en subcomponentes y traducidos a otros valores puede ser necesario ordenarlos siempre en el servidor
     * Si se ordenan en el cliente, no se proporcionara un ordenamiento correcto
     * Es utilizado por ejemplo para las claves foraneas que se muestran a traves del componente "label". El valor original es un id, si se ordena por el id puede no proporcional el valor deseado
     * Si un campo se incluye en serverSortObligatory, casi con seguridad estara tambien incluido su valor en serverSortTranslate
     */
 
   
 
  @Input() sortActive: string = "";
  @Input() sortDirection: SortDirection = "asc";
  @Input() sortDisabled: string[]= []; //campos a los que se deshabilita el ordenamiento
 
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100] 
   
  @Input() footerColumns?: string[]; //columnas de footer a visualizar
  @Input() footer?: FormGroup
  @Input() footerConfig?: FormGroupConfig

  @ViewChild(MatPaginator) paginator?: MatPaginator; //paginacion
  @ViewChild("content", {read: ElementRef}) content!: ElementRef; //contenido para copiar o imprimir
  @ViewChild(MatTable) table!: MatTable<any>;

  @Input() length!: number
  /**
   * Longitud total, puede ser mayor a la que se muestras
   */
  

  ngOnInit(): void {
    this.renderRows();
    this.initDisplayedColumns();
    this.initFooter();
  }

  initDisplayedColumns(){
    if(this.displayedColumns.length) return;

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
  }

  initFooter(){
    if(this.footer && this.footerConfig) this.footerColumns = this.displayedColumns
  }



  onChangeSort(sort: Sort) {
    if(this.paginator) this.paginator.pageIndex = 0;

    if (!sort.active || sort.direction === '') return;
    
    const data = this.control.value;
    
    data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {    
      return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
    });

    this.control.patchValue(data)
    //this.table.renderRows(); se ejecuta el renderRows del valueChanges definido en el OnInit
  }
 
  copyContent(): void {
    if(this.content) copyFormatted(this.content.nativeElement.innerHTML);
  }

  printContent(): void {
    if(this.content) printHtml(this.content.nativeElement.innerHTML);
  }

  renderRows(){
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
}


  
  
