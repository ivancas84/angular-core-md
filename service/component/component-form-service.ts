import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';

/**
 * Comportamiento habitual de componente que incluye un formulario de busqueda
 */

 @Injectable({
  providedIn: 'root'
})
export class ComponentFormService {
      
  constructor(
      protected router: Router, 
  ){}
      
  setNullGroupKey(group: FormGroup, key: string){
    group.controls[key].setValue(null)
  }

  setValueGroupKey(group: FormGroup, key: string, value: any){
    group.controls[key].setValue(value)
  }

  datePickerYearGroupKey(group: FormGroup, key: string, normalizedYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>){
    let ctrlValue = group.controls[key].value;
    ctrlValue = moment();
    /**
     * es conveniente inicializar valor, dependiendo de como se inicialize el valor original puede un string, null o DateTime en vez de un moment()
     */
    ctrlValue.year(normalizedYear.year());

    group.controls[key].setValue(ctrlValue);
    datepicker.close();

  }
  
  

}
