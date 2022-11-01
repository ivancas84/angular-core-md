import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { emptyUrl } from "@function/empty-url.function";
import { LocalStorageService } from "@service/storage/local-storage.service";
import { BehaviorSubject } from "rxjs";
import { Display } from "@class/display";
import { MatSnackBar } from "@angular/material/snack-bar";

/**
 * Comportamiento habitual de componente que incluye un formulario de busqueda
 */

 @Injectable({
  providedIn: 'root'
})
export class ComponentFormService {
      
  constructor(
      protected router: Router, 
      protected local: LocalStorageService,
      protected snackBar: MatSnackBar,
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
    var storageValues = this.local.getItem(this.router.url)
    this.local.removeItemsPrefix(emptyUrl(this.router.url))
    return storageValues;
  }
  
  
  submitted(response:{[index:string]:any}, display$:BehaviorSubject<Display>){
    this.snackBar.open("Registro realizado", "X");
    this.local.removeItemsContains(".");
    if (response["detail"]) this.local.removeItemsPersisted(response["detail"]);
    this.local.removeItemsPrefix(emptyUrl(this.router.url));
    display$.next(display$.value);
  }


}
