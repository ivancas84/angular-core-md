import { Input, Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Display } from '@class/display';
import { FormArrayConfig, FormControlConfig,  AbstractControlOption, FormGroupConfig } from '@class/reactive-form-config';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DialogConfirmComponent } from '@component/dialog-confirm/dialog-confirm.component';
import { emptyUrl } from '@function/empty-url.function';
import { naturalCompare } from '@function/natural-compare';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

declare function copyFormatted(html): any;
declare function printHtml(html): any;

@Component({
  selector: 'core-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export class TableDynamicComponent implements OnInit { //6
  @Input() entityName?: string
  @Input() config: FormArrayConfig
  @Input() footer: FormGroup 
  @Input() footerConfig: FormGroupConfig 
  
  @Input() fieldset: FormArray
  @Input() title: string //titulo del componente
  @Input() sortActive: string = null;
  @Input() sortDirection: string = "asc";
  @Input() sortDisabled: string[]= []; //campos a los que se deshabilita el ordenamiento

  @Input() optTitle: AbstractControlOption[] = []; //opciones de titulo
  @Input() optField: FormControl; //field de opciones
  /**
   * se verifica el valueChanges y se ejecuta la accion seleccionada
   */

  @Input() optColumn: AbstractControlOption[] = []; //columna opciones
  @Input() display?: Display; //busqueda susceptible de ser modificada por ordenamiento o paginacion
  @Input() length?: number; //cantidad total de elementos, puede ser mayor que los datos a visualizar
  @Input() serverSortTranslate: { [index: string]: string[] } = {}; //traduccion de campos de ordenamiento
  /**
   * @example {"nombre":["per-apellidos","per-nombres"], "departamento_judicial":["per_dj-codigo"]}
   */
   @Input() serverSortObligatory: string[] = []; //ordenamiento obligatorio en el servidor
   /**
    * Ciertos campos que son utilizados en subcomponentes y traducidos a otros valores puede ser necesario ordenarlos siempre en el servidor
    * Si se ordenan en el cliente, no se proporcionara un ordenamiento correcto
    * Es utilizado por ejemplo para las claves foraneas que se muestran a traves del componente "label". El valor original es un id, si se ordena por el id puede no proporcional el valor deseado
    * Si un campo se incluye en serverSortObligatory, casi con seguridad estara tambien incluido su valor en serverSortTranslate
    */
  /**
   * Cada elemento debe ser uno de los siguientes OptRouteIcon | OptLinkIcon | OptRouteText | OptLinkText
   */

  displayedColumns: string[]; //columnas a visualizar
  footerColumns: string[]; //columnas de footer a visualizar

  @ViewChild(MatPaginator) paginator: MatPaginator; //paginacion
  @ViewChild("content", {read: ElementRef}) content: ElementRef; //contenido para copiar o imprimir

  protected subscriptions = new Subscription(); //suscripciones en el ts

  @Input() showPaginator:boolean = true; //flag para visualizar el paginador
  @Input() pageSizeOptions=[10, 25, 50, 100] 

  @ViewChild(MatTable) table: MatTable<any>;


  /**
   * si no se define display o length no se muestra la paginacion
   */



  @Output() eventTable: EventEmitter<any> = new EventEmitter();
  

  initOptField(){
    var s = this.optField.valueChanges.subscribe (
      value => this.switchOptField(value),
      error =>  this.snackBar.open(JSON.stringify(error), "X") 
    );
    this.subscriptions.add(s);
  }

  constructor(
    protected router: Router,
    protected dd: DataDefinitionToolService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected storage: SessionStorageService
  ) {}


  //load$: Observable<any>
  
  ngOnInit(): void {
    this.initOptField();
    this.initFieldset();
    this.initDisplayedColumns();
    console.log(this.footer);
    if(!this.length) this.length = this.fieldset.controls.length;    
  }

  initDisplayedColumns(){
    this.displayedColumns = []
    Object.keys(this.config.controls).forEach(key => {
      if((this.config.controls[key] as FormControlConfig).type.id != "hidden")
        this.displayedColumns.push(key)
    })
    if(this.optColumn.length) this.displayedColumns.push("options");
    if(this.footer && this.footerConfig) this.footerColumns = this.displayedColumns
  }


  initFieldset(){
    this.fieldset.valueChanges.pipe(
      //startWith(this.fieldset.value),
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
    this.display.setPage($event.pageIndex+1);
    this.display.setSize($event.pageSize);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());  
  }

  serverSort(sort: Sort): boolean{ 
    if((!this.length || !this.display || this.fieldset.controls.length >= this.length)) {
      if(!this.serverSortObligatory.includes(sort.active)) return false;
    }
    this.display.setOrderByKeys(
      this.serverSortTranslate.hasOwnProperty(sort.active) ? this.serverSortTranslate[sort.active] : [sort.active]
    )
    this.display.setPage(1)
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());  
    return true;
  }

  onChangeSort(sort: Sort) {
    if(this.paginator) this.paginator.pageIndex = 0;

    if(this.serverSort(sort)) return;

    if (!sort.active || sort.direction === '') return;
    
    const data = this.fieldset.value;
    
    data.sort((a, b) => {    
      return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
    });

    this.fieldset.patchValue(data)
    //this.table.renderRows(); se ejecuta el renderRows del valueChanges definido en el OnInit
  }
 
  copyContent(): void {
    if(this.content) copyFormatted(this.content.nativeElement.innerHTML);
  }

  printContent(): void {
    console.log(this.content);
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
    return this.dd.post("delete", this.entityName, [this.fieldset.controls[index].get("id")])
  }

  deleted(index, response){
    /**
     * Acciones una vez realizada la eliminación
     */
    this.fieldset.removeAt(index);
    this.snackBar.open("Registro eliminado", "X")
    this.length--
  }

  removeStorage(response){
    this.storage.removeItemsContains(".");
    this.storage.removeItemsPersisted(response["detail"]);
  }


  fg(index) { return this.fieldset.controls[index]; }
  /**
   * Metodo utilizado para indicar el formGroup en el template
   */
   
  add() {
    var fg = this.config.factory.formGroup();
    this.fieldset.push(fg); 
  }
 
  remove(index) { 
    /**
     * Incorporar el control _mode al fieldset!
     */
    if(!this.fieldset.controls[index].get("id").value) this.fieldset.removeAt(index); 
    else this.fieldset.controls[index].get("_mode").setValue("delete");
  }

  
  
}


 // _controller(index: number) { return this.fieldset.controls[index].get('_mode')}
  
  
