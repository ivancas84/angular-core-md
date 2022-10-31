import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { emptyUrl } from "@function/empty-url.function";
import { isEmptyObject } from "@function/is-empty-object.function";
import { of } from "rxjs";
import { SessionStorageService } from "@service/storage/session-storage.service";

/**
 * Comportamiento habitual de componente que incluye un formulario de busqueda
 */

 @Injectable({
  providedIn: 'root'
})
export class ComponentFormService {
      
  constructor(
      protected router: Router, 
      protected session: SessionStorageService,
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

  initStorageValues(): any{
    var storageValues = this.session.getItem(this.router.url)
    this.session.removeItemsPrefix(emptyUrl(this.router.url))
    return storageValues;
  }
  
  

}
