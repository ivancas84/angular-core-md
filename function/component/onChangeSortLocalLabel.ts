import { FormArray } from "@angular/forms";
import { Sort } from "@angular/material/sort";
import { naturalCompare } from "@function/natural-compare";
import { sortLabelValue } from ".";

/**
   * Variante del sort local que utiliza un metodo adicional para buscar el label y ordenar
   * Es util cuando en el sort se emplean traduciones como es el caso de los autocomplete o select
   */
 export function  onChangeSortLocalLabel(sort: Sort, control: FormArray, options:{[i:string]:{[j:string]:any}[]}): void {
  if (!sort.active || sort.direction === '') return;
  
  const data = control.value;
  
  data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {  
    return (sort.direction === 'asc') ? naturalCompare(sortLabelValue(sort.active,a,options),sortLabelValue(sort.active, b,options)) : naturalCompare(sortLabelValue(sort.active,b,options),sortLabelValue(sort.active, a,options))
  });

  control.patchValue(data)
}


