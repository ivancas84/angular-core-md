import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Display } from "@class/display";
import { DataDefinitionToolService } from "@service/data-definition/data-definition-tool.service";
import { BehaviorSubject, map, Observable, of, switchMap } from "rxjs";

/**
 * Comportamiento habitual de componente que incluye un formulario de busqueda
 */

 @Injectable({
  providedIn: 'root'
})
export class ComponentLoadService {

  constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
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


}
