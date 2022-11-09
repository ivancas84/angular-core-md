import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatExpansionPanel } from "@angular/material/expansion";
import { Router } from "@angular/router";
import { DialogAlertComponent } from "@component/dialog-alert/dialog-alert.component";
import { emptyUrl } from "@function/empty-url.function";
import { isEmptyObject } from "@function/is-empty-object.function";
import { logValidationErrors } from "@function/log-validation-errors";
import { markAllAsTouched } from "@function/mark-all-as-touched";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Display } from "../../class/display";

/**
 * Comportamiento habitual de componente que incluye un formulario de busqueda
 */

 @Injectable({
  providedIn: 'root'
})
export class ComponentSearchService {

  constructor(protected dialog: MatDialog, protected router: Router){}

  searchAndNavigateByUrl(value: any, display: Display, searchPanel: MatExpansionPanel): void {
      display.setParams(value).setPage(1);
      searchPanel.close();
      this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
  }

}
