import { Injectable } from '@angular/core';
import { isEmptyObject } from '@function/is-empty-object.function';
import { LocalStorageService } from '@service/storage/local-storage.service';
import { SessionStorageService } from '@service/storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionStorageService {
  /**
   * Servicio de definicion de storage
   */

  constructor(
    protected stg: LocalStorageService
  ) { }

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