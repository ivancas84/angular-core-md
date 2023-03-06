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
    protected local: LocalStorageService,
    protected session: SessionStorageService
  ) { }

  storage(entity_name: string, row: { [index: string]: any }) {
    var tree = this.session.getItem("tree")[entity_name]
    this.recursive(row, tree)
    this.local.setItem(entity_name + row["id"], row);
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
          this.local.setItem(en + row[fn].id, row[fn]);
          delete row[fn];
        }
      }
    }
  }

}