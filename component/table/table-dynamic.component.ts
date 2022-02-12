import { Input, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Display } from '@class/display';
import { FormArrayConfig, FormGroupConfig, FormGroupFactory, FormConfig, ControlComponent } from '@class/reactive-form-config';
import { AbstractControlViewOption } from '@component/abstract-control-view/abstract-control-view.component';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DialogConfirmComponent } from '@component/dialog-confirm/dialog-confirm.component';
import { EventIconConfig } from '@component/event-icon/event-icon.component';
import { emptyUrl } from '@function/empty-url.function';
import { getControlName } from '@function/get-control-name';
import { naturalCompare } from '@function/natural-compare';
import { titleCase } from '@function/title-case';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

declare function copyFormatted(html): any;
declare function printHtml(html): any;

export class TableDynamicConfig extends FormArrayConfig {
  componentId: string = "table"
  intro?: string;
  /**
   * @param intro: HTML de introduccion que es incluido en el template 
   **/

  entityName?: string
  factory: FormGroupFactory //es necesario definir una clase concreta de FormGroupFactory que permita definir el FormGroup del FormArray
  controls: { [index: string]: FormGroupConfig }

  footer?: FormGroup 
  footerConfig?: FormGroupConfig 
  
  title?: string //titulo del componente
  sortActive: string = null;
  sortDirection: string = "asc";
  sortDisabled: string[]= []; //campos a los que se deshabilita el ordenamiento
  optField: FormControl = new FormControl(); //field de opciones
  optTitle: AbstractControlViewOption[] = [ //opciones de titulo
    {
      config: new EventIconConfig({
        icon: "content_copy", 
        action: "copy_content", 
        color: "primary",
        title:"Copiar",
        fieldEvent: this.optField,
      })
    },
    {
      config: new EventIconConfig({
        icon: "print", 
        action: "print_content",
        color: "primary",
        title:"Copiar",
        fieldEvent: this.optField
      }),
    }
  ]; 

  optColumn: AbstractControlViewOption[] = []; //columna opciones
  /**
   * Columna opciones.
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
  display?: Display; //busqueda susceptible de ser modificada por ordenamiento o paginacion
  length?: number; //cantidad total de elementos, puede ser mayor que los datos a visualizar
  serverSortTranslate: { [index: string]: string[] } = {}; //traduccion de campos de ordenamiento
  /**
   * @example {"nombre":["per-apellidos","per-nombres"], "departamento_judicial":["per_dj-codigo"]}
   */
   serverSortObligatory: string[] = []; //ordenamiento obligatorio en el servidor
   /**
    * Ciertos campos que son utilizados en subcomponentes y traducidos a otros valores puede ser necesario ordenarlos siempre en el servidor
    * Si se ordenan en el cliente, no se proporcionara un ordenamiento correcto
    * Es utilizado por ejemplo para las claves foraneas que se muestran a traves del componente "label". El valor original es un id, si se ordena por el id puede no proporcional el valor deseado
    * Si un campo se incluye en serverSortObligatory, casi con seguridad estara tambien incluido su valor en serverSortTranslate
    */
  /**
   * Cada elemento debe ser uno de los siguientes OptRouteIcon | OptLinkIcon | OptRouteText | OptLinkText
   */
   showPaginator:boolean = true; //flag para visualizar el paginador
   pageSizeOptions=[10, 25, 50, 100] 

   optFooter: AbstractControlViewOption[] = []

   constructor(attributes: any = {}, controls:{ [index: string]: FormConfig } = {}) {
    super({}, controls)
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableDynamicComponent implements ControlComponent, OnInit { //6
  @Input() config: TableDynamicConfig;
  @Input() control: FormArray;

  displayedColumns: string[]; //columnas a visualizar
  footerColumns: string[]; //columnas de footer a visualizar

  @ViewChild(MatPaginator) paginator: MatPaginator; //paginacion
  @ViewChild("content", {read: ElementRef}) content: ElementRef; //contenido para copiar o imprimir

  protected subscriptions = new Subscription(); //suscripciones en el ts

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    protected router: Router,
    protected dd: DataDefinitionToolService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected storage: SessionStorageService
  ) {}

  initOptField(){
    var s = this.config.optField.valueChanges.subscribe (
      value => this.switchOptField(value),
      error =>  this.snackBar.open(JSON.stringify(error), "X") 
    );
    this.subscriptions.add(s);
  }

  ngOnInit(): void {
    this.initOptField();
    this.initFieldset();
    this.initDisplayedColumns();
    if(!this.config.length) this.config.length = this.control.controls.length;    
  }

  initDisplayedColumns(){
    this.displayedColumns = []
    var fg = this.config.factory.formGroup();
    /**
     * Se crea una instancia de formGroup para definir el label
     */
    Object.keys(this.config.controls).forEach(key => {
      if(this.config.controls[key].componentId) this.displayedColumns.push(key);
      if(!this.config.controls[key].label) {
        var n = getControlName(fg.controls[key])
        this.config.controls[key].label = titleCase(n.substring(n.indexOf("-")+1).replace("_"," "))
      }
    })
    if(this.config.optColumn.length) this.displayedColumns.push("options");
    if(this.config.footer && this.config.footerConfig) this.footerColumns = this.displayedColumns
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

  switchOptField($event){
    switch($event.action){
      case "remove": this.remove($event.index); break;
      case "copy_content": this.copyContent(); break;
      case "print_content": this.printContent(); break;
      case "add": this.add(); break;
    }
  }

  onChangePage($event: PageEvent){
    this.config.display.setPage($event.pageIndex+1);
    this.config.display.setSize($event.pageSize);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.config.display.encodeURI());  
  }

  serverSort(sort: Sort): boolean{ 
    if((!this.config.length || !this.config.display || this.control.controls.length >= this.config.length)) {
      if(!this.config.serverSortObligatory.includes(sort.active)) return false;
    }
    this.config.display.setOrderByKeys(
      this.config.serverSortTranslate.hasOwnProperty(sort.active) ? this.config.serverSortTranslate[sort.active] : [sort.active]
    )
    this.config.display.setPage(1)
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.config.display.encodeURI());  
    return true;
  }

  onChangeSort(sort: Sort) {
    if(this.paginator) this.paginator.pageIndex = 0;

    if(this.serverSort(sort)) return;

    if (!sort.active || sort.direction === '') return;
    
    const data = this.control.value;
    
    data.sort((a, b) => {    
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

  removePersist(index: number) {
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
    return this.dd.post("delete", this.config.entityName, [this.control.controls[index].get("id")])
  }

  deleted(index, response){
    /**
     * Acciones una vez realizada la eliminación
     */
    this.control.removeAt(index);
    this.snackBar.open("Registro eliminado", "X")
    this.config.length--
  }

  removeStorage(response){
    this.storage.removeItemsContains(".");
    this.storage.removeItemsPersisted(response["detail"]);
  }


  fg(index) { return this.control.controls[index]; }
  /**
   * Metodo utilizado para indicar el formGroup en el template
   */
   
  add() {
    var fg = this.config.factory.formGroup();
    this.control.push(fg); 
  }
 
  remove(index) { 
    /**
     * Incorporar el control _mode al fieldset!
     */

    if(!this.control.controls[index].get("id").value) this.control.removeAt(index); 
    else this.control.controls[index].get("_mode").setValue("delete");
  }

  
  
}


 // _controller(index: number) { return this.control.controls[index].get('_mode')}
  
  
