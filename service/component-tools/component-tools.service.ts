import { ApplicationRef, ElementRef, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Display } from '@class/display';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { emptyUrl } from '@function/empty-url.function';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsDirty } from '@function/mark-all-as-dirty';
import { naturalCompare } from '@function/natural-compare';
import { startWith, map, BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of, switchMap, tap, first } from 'rxjs';
import { DataDefinitionToolService } from '../data-definition/data-definition-tool.service';
import { LocalStorageService } from '../storage/local-storage.service';

/**
 * Funciones habituales de componentes
 * El código habitual de los componentes puede ser resuelto mediante una función presente en este archivo.
 * Si hay código habitual que no necesita un servicio, verificar el conjunto de funciones en function/component.ts
 * El objetivo perseguido por este conjunto de funciones es ahorrar codigo, pudiendo ser reemplazado su uso si se requiere.
 */


declare function copyFormatted(html: any): any;
declare function printHtml(html: any): any;

@Injectable({
  providedIn: 'root'
})
export class ComponentToolsService {

  constructor(
    protected router: Router, 
    protected ar:ApplicationRef,
    protected local: LocalStorageService,
    protected snackBar: MatSnackBar,
    protected dialog: MatDialog,
    protected dd: DataDefinitionToolService,
    protected route: ActivatedRoute, 
){}
    

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
    display.setPage($event.pageIndex+1).setSize($event.pageSize);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
  }

  

  

  copyContent(content: ElementRef, displayedColumns: string[]): void {
    if(content) {
      var index =displayedColumns.indexOf("options");
      if (index !== -1) {
        displayedColumns.splice(index, 1);
        this.ar.tick()
      }
      copyFormatted(content.nativeElement.innerHTML);
      if (index !== -1) displayedColumns.splice(index, 0, "options");
    }
  }

  printContent(content: ElementRef, displayedColumns: string[]): void {
    if(content) {
      var index = displayedColumns.indexOf("options");
      if (index !== -1) {
        displayedColumns.splice(index, 1);
        this.ar.tick()
      }
      printHtml(content.nativeElement.innerHTML);
      if (index !== -1) displayedColumns.splice(index, 0, "options");
    }
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
   * @example submitPersona(){
      this.tools.submit("persona",this.controlPersona,this.display$).pipe(first()).subscribe({
        error: (error: any) => this.tools.dialogError(error),
        complete: () => this.isSubmitted = false
      })
    }
   */
  persist(entityName: string, control: FormGroup, display$: BehaviorSubject<Display>): Observable<any> {
    if (!control.valid) {
      logValidationErrors(control)
      this.cancelSubmit(control)
      return of(null)
    } else {
      return this.dd._post("persist", entityName, control.value).pipe(
        map(
          response => {
            this.submittedDisplay(response,display$)
            return true;
          }
        )
      );
    } 
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


  /**
   * @example this.loadParams$ = loadParams(this.display$) 
   */
   loadParams(display$:BehaviorSubject<Display>){
    
    return this.route.queryParams.pipe(
      map(
        queryParams => { 
          var display = new Display().setSize(100).setParamsByQueryParams(queryParams);
          display$.next(display)
          return true;
        },
      ),
    )
  }

 
  

  loadLength(entityName: string, display: Display): Observable<number> {
    /**
     * Si no se desea procesar la longitud, retornar of(null)
     */
    return this.dd.post("count", entityName, display)
  }

  loadArrayData(entityName: string, display: Display, keys: string[]): Observable<any>{
    return this.dd.post("ids", entityName, display).pipe(
      switchMap(
        ids => this.dd.entityFieldsGetAll({ entityName, ids, fields: keys })
      )
    )
  }

  loadLengthData(entityName: string, display: Display, keys: string[]):  Observable<any>{
    var length = 0;
    return this.loadLength(entityName, display).pipe(
      switchMap(
        _length => {
          length = _length
          if(!length) return of({length:0, data:[]})
          return this.loadArrayData(entityName,display,keys).pipe(
            map(
              data => {
                return {length:length,data:data}
              }
            )
          )
        }
      )
    )
  }


  searchAndNavigateByUrl(value: any, display: Display, searchPanel: MatExpansionPanel): void {
    display.setParams(value).setPage(1);
    searchPanel.close();
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
  }


  dialogError(data: {error:string}){
    this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message: data.error}
    });
  }
}
