import { Injectable } from '@angular/core';
import { isEmptyObject } from '@function/is-empty-object.function';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { Observable } from 'rxjs';
import { DataDefinitionService } from './data-definition.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionLabel2Service {
  /**
   * Servicio de definicion de storage
   */

  constructor(
    protected dd: DataDefinitionService,
    protected stg: SessionStorageService
  ){ }

  // label(entityName: string, id: string): Observable<string> {
    
  // }
  
  storage(entityName: string, row: { [index: string]: any }) {
    var tree = this.stg.getItem(entityName+".tree")
    this.recursive(row, tree)
    this.stg.setItem(entityName + row["id"], row);
    return row;
  }

  public recursive(row: { [index: string]: any }, tree: { [index: string]: any }){
    for(var key in tree){
      if(tree.hasOwnProperty(key)) {
        var en = tree[key]["entity_name"];
        var fn = tree[key]["field_name"]+"_";

        if(row.hasOwnProperty(fn)){
          if(!isEmptyObject(tree[key]["children"])){
            this.recursive(row[fn], tree[key]["children"]);
          }
          this.stg.setItem(en + row[fn].id, row[fn]);
          delete row[fn];
        }
      }
    }
  }

}