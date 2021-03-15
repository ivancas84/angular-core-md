import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataDefinitionRelArrayService } from '@service/data-definition-rel-array/data-definition-rel-array.service';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ShowAdminDynamicComponent } from './show-admin-dynamic.component';

@Component({
  selector: 'core-show-admin-rel-dynamic',
  templateUrl: './show-admin-dynamic.component.html',
})
export abstract class ShowAdminRelDynamicComponent extends ShowAdminDynamicComponent { //v1
  /**
   * Variante de ShowAdminDynamic para utilizar campos de relaciones
   */
  
   constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
    protected validators: ValidatorsService,
    protected ddra: DataDefinitionRelArrayService
  ) {
    super(dd,route,dialog, validators)
  }
  
  persistApi: string = "persist_rel_array"; //persistApi de TableAdmin 
  reloadApi: string = "unique_rel_array"; //reloadApi de TableAdmin

  queryData(): Observable<any>{
    return this.dd.post("ids", this.entityName, this.display).pipe(
      switchMap(
        ids => {
          return this.ddra.main(this.entityName, ids);
        }
      )
    )
  }

}
