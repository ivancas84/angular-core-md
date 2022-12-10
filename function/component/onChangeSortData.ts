import { Sort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { naturalCompare } from "@function/natural-compare";

/**
 * Ordenamiento local (sin servidor)
 * Se utiliza principalmente cuando se posee el juego completo de datos
 */
 export function onChangeSortData(sort: Sort, data: {[i:string]:any}[], table: MatTable<any>): void {
  if (!sort.active || sort.direction === '') return;
  
  data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {  
    return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
  });

  table.renderRows()
}
