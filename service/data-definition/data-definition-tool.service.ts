import { Injectable } from '@angular/core';
import { arrayColumn } from '@function/array-column';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataDefinitionService } from './data-definition.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionToolService extends DataDefinitionService{

  getAllColumnData(
    data: { [index: string]: any }[], 
    fieldName: string, 
    entityName: string, 
    fields: { [index: string]: string }
  ): Observable<{ [index: string]: any }[]>{
    var ids = arrayColumn(data, fieldName);
    return this.getAll(entityName, ids).pipe(
      map(
        response => {
          for(var i = 0; i < data.length; i++){
            for(var f in fields){
              if(fields.hasOwnProperty(f)){
                data[i][f] = response[i][fields[f]];
              }
            }
          }
          return data;
        }
      )
    );  
  }
}
