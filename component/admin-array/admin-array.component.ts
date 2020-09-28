import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
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

@Component({
  selector: 'core-admin-array',
  template: '',
changeDetection: ChangeDetectionStrategy.OnPush


})
export abstract class AdminArrayComponent extends AdminComponent {
/**
 * Formulario de administracion para un conjunto de datos
 * Es similiar a AdminComponent pero tiene ciertas restricciones para trabajar con un conjunto de datos
 */

  constructor(
    protected fb: FormBuilder, 
    protected route: ActivatedRoute, 
    protected router: Router, 
    protected location: Location, 
    protected dd: DataDefinitionService, 
    protected storage: SessionStorageService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
  ) {
    super(fb,route, router, location, dd, storage, dialog, snackBar)
  }
    
  setParams(params: any){
    if(params.hasOwnProperty("ids") && params["ids"]) {
      this.params = (Array.isArray(params["ids"])) ? params["ids"] : [params["ids"]]
    } else {
      this.params = null;
    } 
  }

  setData(): void {
    if(isEmptyObject(this.params)) {
      this.data$.next([]);
      return;
    } 

    this.dd.getAll(this.entityName, this.params).pipe(first()).subscribe(
      response => {
        var filtered = response.filter(function (el) { return el != null; });
        /** 
         * Debido a la constante manipulacion de ids 
         * Sucede que se consultan ids eliminados
         * por lo tanto debe filtrarse la respuestaantes de cargar
         */
        this.data$.next(filtered);
      },
      error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
      }
    ); 
  }
  
  persist(): Observable<any> {
    return this.dd.post("persist_array", this.entityName, this.serverData())
  }

  reload(response){
    this.snackBar.open("Registro realizado", "X");
    let route = emptyUrl(this.router.url) + "?ids="+response["ids"].join("&ids=");
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.setData();
    this.isSubmitted = false;
  }

}