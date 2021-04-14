import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { ShowDynamicComponent } from './show-dynamic.component';
import { DataDefinitionRelArrayService } from '@service/data-definition-rel-array/data-definition-rel-array.service';
import { isEmptyObject } from '@function/is-empty-object.function';

@Component({
  selector: 'core-show-rel-dynamic',
  template: '',
})
export abstract class ShowRelDynamicComponent extends ShowDynamicComponent { //1.3
  constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
    protected ddra: DataDefinitionRelArrayService
  ) {
    super(dd,route,dialog)
  }

  queryData(): Observable<any>{
    return this.dd.post("ids", this.entityName, this.display).pipe(
      switchMap(
        ids => this.dd.relGetAllFvo(this.entityName, ids, this.fieldsViewOptions)
      )
    )
  }
}
