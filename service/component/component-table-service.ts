import { Injectable } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { Router } from "@angular/router";
import { emptyUrl } from "@function/empty-url.function";
import { naturalCompare } from "@function/natural-compare";
import { debounceTime, map, Subscription } from "rxjs";
import { Display } from "../../class/display";

/**
 * Comportamiento habitual de componente que incluye un formulario de busqueda
 */

 @Injectable({
  providedIn: 'root'
})
export class ComponentTableService {
      
  constructor(
      protected router: Router, 
  ){}
      
  initDisplayedColumns(formGroup: FormGroup) {
    return Object.keys(formGroup.controls)
  }

  /**
   * @example
   * ngAfterViewInit(): void {
   *   this.subscriptions.add(
   *     this.ts.renderRowsOnValueChanges(this.control, this.table)
   *   )
   * }
   */
  renderRowsOnValueChanges(control: FormArray, table: MatTable<any>): Subscription {
    return control.valueChanges.pipe(
      //startWith(this.control.value),
      debounceTime(100),
      map(
        () => {

          if(table) table.renderRows()
        }
      )
    ).subscribe(
      () => {}
    );
  }

  serverSort(sort: Sort, length: number, display:Display, control: FormArray, serverSortObligatory: string[] = [], serverSortTranslate:{[index:string]:string[]}= {}): boolean{ 
    if((!length || !display || control.controls.length >= length)) {
      if(!serverSortObligatory.includes(sort.active)) return false;
    }

    display.setOrderByKeys(
      serverSortTranslate.hasOwnProperty(sort.active) ? serverSortTranslate[sort.active] : [sort.active]
    )
    display.setPage(1)
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
    return true;
  }

  onChangeSort(sort: Sort, length: number, display:Display, control: FormArray, serverSortTranslate:{[index:string]:string[]}= {}, serverSortObligatory: string[] = [], paginator?: MatPaginator): void {
    if(paginator) paginator.pageIndex = 0;

    if(this.serverSort(sort,length, display, control,serverSortObligatory, serverSortTranslate)) return;

    if (!sort.active || sort.direction === '') return;
    
    const data = control.value;
    
    data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {    
      return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
    });

    control.patchValue(data)
  }

  onChangePage($event: PageEvent, display: Display){
    display.setPage($event.pageIndex+1);
    display.setSize($event.pageSize);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
  }

}
