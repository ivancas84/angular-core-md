import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { isEmptyObject } from '@function/is-empty-object.function';
import { DataDefinitionRelArrayService } from '@service/data-definition-rel-array/data-definition-rel-array.service';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ShowAdminDynamicComponent } from './show-admin-dynamic.component';

@Component({
  selector: 'core-show-admin-rel-dynamic',
  templateUrl: './show-admin-dynamic.component.html',
})
export abstract class ShowAdminRelDynamicComponent extends ShowAdminDynamicComponent { //1.2
  /**
   * Variante de ShowAdminDynamic para utilizar campos de relaciones
   */
  
   constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
    protected validators: ValidatorsService,
    protected storage: SessionStorageService,
    protected ddra: DataDefinitionRelArrayService
  ) {
    super(dd,route,dialog, storage, validators)
  }
  
  persistApi: string = "persist_rel_array"; //persistApi de TableAdmin 
  reloadApi: string = "unique_rel_array"; //reloadApi de TableAdmin

  queryData(): Observable<any>{
    return this.dd.post("ids", this.entityName, this.display).pipe(
      switchMap(
        ids => {
          var fields = {};
          for(var i = 0; i < this.fieldsViewOptions.length; i++){
            var f = this.fieldsViewOptions[i].field;
            if(f.includes("-")){
              var n = f.indexOf("-");
              fields[f]= f.substring(n+1)
            }
          }
          return (isEmptyObject(fields)) ? 
            this.dd.getAll(this.entityName, ids) :
            this.dd.relGetAll(this.entityName, ids, fields);
        }
      )
    )
  }

}
