import { Injectable } from '@angular/core';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { recursiveData } from '@function/recursive-data';
import { DataDefinitionLabelService } from '@service/data-definition-label/data-definition-label.service';
import { combineLatest, Observable, of } from 'rxjs';
import { combineAll, map, switchMap } from 'rxjs/operators';
import { DataDefinitionService } from './data-definition.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionRelLabelService { 
  
  /**
   * Traducir parametros de una entidad para definir los labels
   */

  constructor(
    protected dd: DataDefinitionService,
    protected ddl: DataDefinitionLabelService 
  ) { }


  public labels(params, entityName){
    if(isEmptyObject(params)) return of([])

    return this.dd.post("rel",entityName).pipe(
      switchMap(
        rel => {
          var obs = []
          Object.keys(rel).forEach(key => {
            if(params.hasOwnProperty(rel[key]["field_id"])){
              obs.push(
                this.ddl.label(
                  rel[key]["entity_name"],
                  params[
                    rel[key]["field_id"]
                  ]
                )
              )
            }
          })
          console.log(obs.length);
          
          return (!obs.length) ? of([]) : combineLatest(obs)
        }        
      )
    )  
  }


}
