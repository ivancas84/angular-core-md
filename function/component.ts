
/**
 * Funciones que permiten ahorrar codigo en los componentes
 * El objetivo es ahorrar codigo pero que sea facilimente reemplazable y entendible la funcion si es que se necesita
 */

import { FormGroup } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { Display } from "@class/display";
import * as moment from 'moment';
import { BehaviorSubject, Observable, map } from "rxjs";
import { isEmptyObject } from "./is-empty-object.function";

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
  