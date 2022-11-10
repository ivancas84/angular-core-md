
/**
 * Funciones habituales de componentes
 * El código habitual de los componentes puede ser resuelto mediante una función presente en este archivo.
 * Si hay código habitual que necesita un servicio, verificar el servicio ComponentTools
 * El objetivo perseguido por este conjunto de funciones es ahorrar codigo, pudiendo ser reemplazado su uso si se requiere.
 */

import { FormArray, FormGroup } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { Sort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { Display } from "@class/display";
import * as moment from 'moment';
import { BehaviorSubject, Observable, map, debounceTime, Subscription } from "rxjs";
import { isEmptyObject } from "./is-empty-object.function";
import { naturalCompare } from "./natural-compare";

export function datePickerYearGroupKey(group: FormGroup, key: string, normalizedYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>){
    // let ctrlValue = group.controls[key].value;
    let ctrlValue = moment();
    /**
     * es conveniente inicializar valor, dependiendo de como se inicialize el valor original puede un string, null o DateTime en vez de un moment()
     */
    ctrlValue.year(normalizedYear.year());

    group.controls[key].setValue(ctrlValue);
    datepicker.close();
}

/**
 * Comportamiento habitual para inicializar un search control
 * @example loadControl$ =  loadSearchControl(this.controlSearch, this.display$)
 */
export function loadSearchControl(control: FormGroup, display$: BehaviorSubject<Display>): Observable<any> {
    return display$.pipe(
        map(
            display => {
                if(!isEmptyObject(display.getParams()))
                control.reset(display.getParams()) 
                return true
            }
        )
      )
}

export function setNullGroupKey(group: FormGroup, key: string): void {
    group.controls[key].setValue(null)
}
  

export function setValueGroupKey(group: FormGroup, key: string, value: any): void {
    group.controls[key].setValue(value)
}
  
 /**
   * @example
   * ngAfterViewInit(): void {
   *   this.subscriptions.add(
   *     this.ts.renderRowsOfTableOnValueChanges(this.control, this.table)
   *   )
   * }
   */
export function renderRowsOfTableOnValueChanges(control: FormArray, table: MatTable<any>): Subscription {
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


/**
 * Ordenamiento local (sin servidor)
 * Se utiliza principalmente cuando se posee el juego completo de datos
 */
export function onChangeSortLocal(sort: Sort, control: FormArray): void {
  if (!sort.active || sort.direction === '') return;
  
  const data = control.value;
  
  data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {  
    return (sort.direction === 'asc') ? naturalCompare(a[sort.active],b[sort.active]) : naturalCompare(b[sort.active],a[sort.active])
  });

  control.patchValue(data)
}


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

function sortLabelValue(fieldName:string, row:{[i:string]:any}, options:{[i:string]:{[j:string]:any}[]}): any{
  if(!options.hasOwnProperty(fieldName)) return row[fieldName]

  for(var i = 0; i < options[fieldName].length; i++){
    if(row[fieldName] == options[fieldName][i]["id"]) return options[fieldName][i]["label"]
  }

}



export function initDisplayedColumns(formGroup: FormGroup) {
  return Object.keys(formGroup.controls)
}



