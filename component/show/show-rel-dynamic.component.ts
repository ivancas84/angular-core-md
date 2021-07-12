import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { ShowDynamicComponent } from './show-dynamic.component';
import { isEmptyObject } from '@function/is-empty-object.function';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { DataDefinitionRelFieldsService } from '@service/data-definition/data-definition-rel-fields.service';

@Component({
  selector: 'core-show-rel-dynamic',
  template: '',
})
export abstract class ShowRelDynamicComponent extends ShowDynamicComponent { //1.3
 
  constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
    protected storage: SessionStorageService,
    protected ddrf: DataDefinitionRelFieldsService
  ) {
    super(dd, route, dialog, storage)

  }
  
  queryData(): Observable<any>{
    return this.dd.post("ids", this.entityName, this.display).pipe(
      switchMap(
        ids => this.ddrf.getAllFvo(this.entityName, ids, this.fieldsViewOptions)
      )
    )
  }
}
