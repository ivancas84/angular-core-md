import { Injectable } from '@angular/core';
import { isEmptyObject } from '@function/is-empty-object.function';
import { DataDefinitionLabelService } from '@service/data-definition-label/data-definition-label.service';
import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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


  public labels(params: {[index:string]:string}, entityName:string){
    if(isEmptyObject(params)) return of([])

    return this.dd.post("rel",entityName).pipe(
      switchMap(
        rel => {
          var obs: any[] = []
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
          
          return (!obs.length) ? of([]) : combineLatest(obs)
        }        
      )
    )  
  }


}
