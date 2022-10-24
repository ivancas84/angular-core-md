import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { emptyUrl } from '@function/empty-url.function';
import { naturalCompare } from '@function/natural-compare';
import { TablePaginatorComponent } from './table-paginator.component';

@Component({
  selector: 'core-table-sort',
  template: '',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export abstract class TableSortComponent extends TablePaginatorComponent {
  serverSortTranslate: { [index: string]: string[] } = {};
  /**
   * traduccion de campos de ordenamiento
   * 
   * @example {"nombre":["persona-apellidos","persona-nombres"], "departamento_judicial":["departamento_judicial-codigo"]}
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
}



  
  
