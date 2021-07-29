import { Input, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Display } from '@class/display';
import { emptyUrl } from '@function/empty-url.function';
import { markAllAsTouched } from '@function/mark-all-as-touched';
import { logValidationErrors } from '@function/log-validation-errors';
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'core-search',
  template: '',
})
export abstract class SearchComponent {

  @Input() display: Display;
  /**
   * Busqueda a traves de condicion
   * implementacion opcional mediante componente SearchCondition
   */ 

  searchForm: FormGroup = this.fb.group({});
  /**
   * Formulario de busqueda
   */


  isSubmitted: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton aceptar
   */

  @ViewChild(MatExpansionPanel) searchPanel: MatExpansionPanel;

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected dialog: MatDialog,
  ) {}



  onSubmit(): void {
    /**
     * Transformar valores del atributo display a traves de los valores del formulario
     */

    this.isSubmitted = true;

    if (!this.searchForm.valid) {
      markAllAsTouched(this.searchForm);
      logValidationErrors(this.searchForm);
      this.dialog.open(DialogAlertComponent, {
        data: {title: "Error", message: "El formulario posee errores."}
      });
      this.isSubmitted = false;
    } else {
      if(this.searchForm.get("condition")) this.display.setConditionByFilters(this.searchForm.get("condition").value);    
      if(this.searchForm.get("params")) this.display.setParams(this.searchForm.get("params").value);    
      if(this.searchForm.get("order")) { this.display.setOrderByElement(this.searchForm.get("order").value); }    
      this.display.setPage(1);
      this.searchPanel.close();
      this.search();
    }
  }
  
  search(): void {
    /** Metodo independiente para facilitar reimplementacion */
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());  
  }
}
