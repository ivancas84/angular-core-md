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
import { Display } from "../../class/display";

/**
 * Comportamiento habitual de componente que incluye un formulario de busqueda
 */

 @Injectable({
  providedIn: 'root'
})
export class ComponentSearchService {

  constructor(protected dialog: MatDialog, protected router: Router){}
      
  loadControl(control: FormGroup, display: Display): void{
    if(!isEmptyObject(display.getParams()))
    control.reset(display.getParams()) 
  }

  onSubmit(control: FormGroup, display: Display, searchPanel: MatExpansionPanel, isSubmitted: boolean ): void {
    /**
     * Transformar valores del atributo display a traves de los valores del formulario
     */

    isSubmitted = true;

    if (!control.valid) {
      markAllAsTouched(control);
      logValidationErrors(control);
      this.dialog.open(DialogAlertComponent, {
        data: {title: "Error", message: "El formulario posee errores."}
      });
      isSubmitted = false;
    } else {
      display.setParams(control.value);    
      display.setPage(1);
      searchPanel.close();
      this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
    }
  }
}
