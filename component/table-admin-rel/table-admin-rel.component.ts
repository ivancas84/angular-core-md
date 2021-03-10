import { Input, Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DialogConfirmComponent } from '@component/dialog-confirm/dialog-confirm.component';
import { TableAdminComponent } from '@component/table-admin/table-admin.component';
import { TableComponent } from '@component/table/table.component';
import { emptyUrl } from '@function/empty-url.function';
import { fastClone } from '@function/fast-clone';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsDirty } from '@function/mark-all-as-dirty';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'core-table-admin-rel',
  template: '',
})
export abstract class TableAdminRelComponent extends TableAdminComponent implements OnChanges {
  /**
   * Especializacion de TableAdminComponent 
   * para administrar una entidad y sus relaciones
   * El unico cambio que incorpora es en el metodo para obtener los datos
   * Ejemplo de retorno de consulta datos [
   *   {id:"13124123"}
   *   {activo:true}
   *   {per-id:"15234234"}
   *   {per-nombres:"Juan"}
   *   {per_dom-id:"2349291"}
   *   {per_dom-detalle:"Calle 42 Nº 24"}   
   * ]
   */

  persistApi:string = "persist_rel";

  reload(index: number, id){
    /**
     * @todo Recargar valores de la fila i
     */
    this.dd._post("unique_rel_array", this.entityName, id).subscribe(
      row => {
        this.forms[index].reset(row)
        this.isSubmitted[index] = false
      }
    )
  }
  
}
