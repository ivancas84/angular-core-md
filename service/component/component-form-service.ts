import { Injectable } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { emptyUrl } from "@function/empty-url.function";
import { LocalStorageService } from "@service/storage/local-storage.service";
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap, tap } from "rxjs";
import { Display } from "@class/display";
import { MatSnackBar } from "@angular/material/snack-bar";
import { markAllAsDirty } from "@function/mark-all-as-dirty";
import { MatDialog } from "@angular/material/dialog";
import { DialogAlertComponent } from "@component/dialog-alert/dialog-alert.component";
import { DataDefinitionToolService } from "@service/data-definition/data-definition-tool.service";

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
      protected dialog: MatDialog,
      protected dd: DataDefinitionToolService,
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

   /**
   * @example this.loadStorage$ = ngOnInitLoadStorage(this.display$) 
   */
    loadStorage(control: AbstractControl) {
      return control.valueChanges.pipe(
        startWith(this.local.getItem(this.router.url)),
        map(
          sessionValues => {
            this.local.setItem(this.router.url, sessionValues)
            return true;
          }
      ))
    }
  
  
  cancelSubmit(control: AbstractControl){
    markAllAsDirty(control);
    //logValidationErrors(this.control);
    this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message: "El formulario posee errores."}
    });
  }


  submittedDisplay(response:{[index:string]:any}, display$:BehaviorSubject<Display>){
    this.submitted(response)
    this.local.removeItemsPrefix(emptyUrl(this.router.url));
    display$.next(display$.value);
  }

  submitted(response:{[index:string]:any}){
    this.snackBar.open("Registro realizado", "X");
    this.local.removeItemsContains(".");
    if (response["detail"]) this.local.removeItemsPersisted(response["detail"]);
  }

  /**
   * Inicializar filtered options
   * @example filteredOptions$ = this.formService.filteredOptionsAutocomplete()
   */
  filteredOptionsAutocomplete({entityName, control, searchControl}: { 
    entityName: string; 
    control: AbstractControl; 
    searchControl: FormControl; 
  }): Observable<Array<{ [key: string]: any; }>>{
    searchControl.setValidators(control.validator)

    return searchControl.valueChanges.pipe(
      tap(value => {
        if(value && (typeof value != "string" ) && (value.id != control.value)) {
          control.setValue(value.id)  
        }
      }),
      debounceTime(300),

      distinctUntilChanged(),
      switchMap(value => {
        console.log(value)
        if (typeof value == "string") {
          if(value === "") return of([]);
          var display = new Display().addCondition(["_label","=~",value]);
          return this.dd.post("label_all",entityName, display)
        }
        else {
          searchControl.disable();
          return of([])
        }
      })
    )  
  }

  /**
   * Preinicializar load$
   * @example load$ = this.formService.labelAutocomplete().pipe(
   *   map(
   *     label => {
   *       this.label = label["0"];
   *       return true;
   *     }
   *   )
   * )
   */
  labelAutocomplete({entityName, control, searchControl}: { 
    entityName: string; 
    control: AbstractControl; 
    searchControl: FormControl; 
  }): Observable<any>{
    return control.valueChanges.pipe(
      startWith(control.value),
      switchMap(
        value => {
          //no existe valor de control
          if(!value) {
            searchControl.setValue("");
            if(control.enabled) searchControl.enable();
            return of(null)
          }

          //existe valor de control
          return this.searchControlAutocompleteUpdate(entityName,value,searchControl).pipe(
            switchMap(
              value => this.dd.post("label_get",entityName, value).pipe(
                map(label => label["label"])
              )
            )
          )
        }
      ),
    );
  }

  private searchControlAutocompleteUpdate(entityName: string, value:string, searchControl: FormControl, ){
    /** Existe valor de control, se debe actualizar searchControl*/
    if(value && (!searchControl.value
      || (typeof searchControl.value != "string" 
      && searchControl.value.id != value))){
        return this.dd.get(entityName,value).pipe(
          map(
            row => {
              searchControl.setValue(row);
              searchControl.disable();
              return value
            }
          )
        )
    }

    /** Existe valor de control y searchControl esta correctamente asignado */
    searchControl.disable();
    return of(value)
    
  }


}
