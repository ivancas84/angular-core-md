import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Display } from '@class/display';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { MatDialog } from '@angular/material/dialog';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { ShowComponent } from '@component/show/show.component';
import { ValidatorsService } from '@service/validators/validators.service';
import { ShowAdminComponent } from '@component/show-admin/show-admin.component';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-show-admin-dybamic',
  templateUrl: './show-admin-dynamic.component.html',
})
export abstract class ShowAdminDynamicComponent extends ShowAdminComponent {
  /**
   * Componente general para las interfaces ShowAdmin 
   * que implementan estructuras dinamicas
   */

  fieldsViewOptions: FieldViewOptions[] = []; //visualizacion
  fieldsViewOptionsSp: FieldViewOptions[] = []; //busqueda
  persistApi: string = "persist"; //persistApi de TableAdmin 
  /**
   * Puede utilizarse persist_rel_array
   * si se desea administrar una entidad y sus relaciones
   */

  reloadApi: string = "get"; //reloadApi de TableAdmin
  /**
   * Puede utilizarse persist_rel_array
   * si se desea administrar una entidad y sus relaciones
   */

  deleteApi: string = "delete"; //DeleteApi de TableAdmin

  constructor(
    protected dd: DataDefinitionToolService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
    protected validators: ValidatorsService, //los atributos fieldViewOptions y fieldViewOptionsFiters utilizar validadores
  ) {
    super(dd,route,dialog)
  }


}
