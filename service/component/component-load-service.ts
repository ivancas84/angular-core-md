import { Injectable } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Display } from "@class/display";
import { DataDefinitionToolService } from "@service/data-definition/data-definition-tool.service";
import { SessionStorageService } from "@service/storage/session-storage.service";
import { BehaviorSubject, catchError, map, Observable, of, startWith, Subscription, switchMap } from "rxjs";

/**
 * Comportamiento habitual de componente que incluye un formulario de busqueda
 */

 @Injectable({
  providedIn: 'root'
})
export class ComponentLoadService {

  constructor(
    protected dd: DataDefinitionToolService, 
    protected dialog: MatDialog,
    protected route: ActivatedRoute, 
    protected router: Router, 
    protected storage: SessionStorageService,
    protected snackBar: MatSnackBar,
  ){}

  /**
   * @example this.loadParams$ = loadParams(this.display$) 
   */
  loadParams(display$:BehaviorSubject<Display>){
    
    return this.route.queryParams.pipe(
      map(
        queryParams => { 
          var display = new Display();
          display.setSize(100);
          display.setParamsByQueryParams(queryParams);
          display$.next(display)
          return true;
        },
      ),
    )
  }

  /**
   * @example this.loadStorage$ = ngOnInitLoadStorage(this.display$) 
   */
  loadStorage(control: AbstractControl) {
    return control.valueChanges.pipe(
      startWith(this.storage.getItem(this.router.url)),
      map(
        storageValues => {
          this.storage.setItem(this.router.url, storageValues)
          return true;
        }
    ))
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
        ids => this.dd.entityFieldsGetAll(entityName, ids, keys)
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


}
