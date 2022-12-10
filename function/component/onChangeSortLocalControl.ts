import { FormArray } from "@angular/forms";
import { Sort } from "@angular/material/sort";
import { naturalCompare } from "@function/natural-compare";

/**
 * Ordenamiento local (sin servidor)
 * Se utiliza principalmente cuando se posee el juego completo de datos
 */
 export function onChangeSortLocalControl(sort: Sort, control: FormArray): void {
  if (!sort.active || sort.direction === '') return;
  
  const data = control.value;
  
  data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {  
    return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
  });

  control.patchValue(data)
}
