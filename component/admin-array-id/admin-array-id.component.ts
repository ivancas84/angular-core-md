import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { emptyUrl } from '../../function/empty-url.function';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { isEmptyObject } from '../../function/is-empty-object.function';
import { OnInit, AfterViewInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { markAllAsDirty } from '../../function/mark-all-as-dirty';
import { logValidationErrors } from '../../function/log-validation-errors';
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminComponent } from '@component/admin/admin.component';
import { ValidatorsService } from '@service/validators/validators.service';
import { fastClone } from '@function/fast-clone';

@Component({
  selector: 'core-admin-array-id',
  template: '',
})
export abstract class AdminArrayIdComponent extends AdminComponent {
/**
 * Variante del formulario de administracion que recibe obligatoriamente un identificador
 * y lo transfiere a sus componentes anidados
 * El identificador no necesariamente debe ser el id de la entidad, puede ser algun campo unico
 */

  adminForm: FormGroup = this.fb.group({
    id: ['', Validators.required ],
  });

  constructor(
    protected fb: FormBuilder, 
    protected route: ActivatedRoute, 
    protected router: Router, 
    protected location: Location, 
    protected dd: DataDefinitionService, 
    protected storage: SessionStorageService, 
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,

    protected validators: ValidatorsService,
  ) {
    super(fb, route, router, location, dd, storage, dialog, snackBar);
  }

 

  initParams(params: any){
    if(params.hasOwnProperty("id") && params["id"]) {  
      this.adminForm.get("id").setValue(params["id"]);
      this.storage.removeItemsPrefix(emptyUrl(this.router.url)); //debe eliminarse el storage porque fue asignado el id
      return params;
    } else {
      this.snackBar.open("Error de parametros", "X"); 
      throw new Error("Error de parametros");
    }
  }

  initData(): Observable<any> {
    return of(fastClone(this.display$.value));
  }

  persist(): Observable<any> {
    return this.dd.post("persist_array", this.entityName, this.serverData())
  }

  reload(response){
    /**
     * Recargar una vez persistido
     */
    this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

}