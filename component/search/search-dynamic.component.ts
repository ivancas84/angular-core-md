import { Input, Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Display } from '@class/display';
import { FormStructureConfig } from '@class/reactive-form-config';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { emptyUrl } from '@function/empty-url.function';
import { isEmptyObject } from '@function/is-empty-object.function';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsTouched } from '@function/mark-all-as-touched';

@Component({
  selector: 'core-search-dynamic',
  templateUrl: './search-dynamic.component.html',
})
export class SearchDynamicComponent implements OnInit {
 
  @Input() form: FormGroup;
  @Input() config: FormStructureConfig;
  @Input() display: Display;
  /**
   * Busqueda a traves de condicion
   * implementacion opcional mediante componente SearchCondition
   */ 

  @Input() title: string = "Opciones"


  isSubmitted: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton aceptar
   */

  @ViewChild(MatExpansionPanel) searchPanel: MatExpansionPanel;

  constructor(
    protected router: Router,
    protected dialog: MatDialog,
  ) {}
  

  ngOnInit(){
    if(this.config.controls.hasOwnProperty("params") && !isEmptyObject(this.display.getParams()))
      this.form.controls["params"].reset(this.display.getParams()) 

    var c = this.display.getCondition()
    if(this.config.controls.hasOwnProperty("params") && !isEmptyObject(c)){
       /*for(let i = 0; i < c.length; i++){
         let elFG = this.formGroup(c[i][0], c[i][1], c[i][2]);
         elementsFGs.push(elFG);
       }*/
    }
  }

  onSubmit(): void {
    /**
     * Transformar valores del atributo display a traves de los valores del formulario
     */

    this.isSubmitted = true;

    if (!this.form.valid) {
      markAllAsTouched(this.form);
      logValidationErrors(this.form);
      this.dialog.open(DialogAlertComponent, {
        data: {title: "Error", message: "El formulario posee errores."}
      });
      this.isSubmitted = false;
    } else {
      if(this.form.get("condition")) this.display.setConditionByFilters(this.form.get("condition").value);    
      if(this.form.get("params")) this.display.setParams(this.form.get("params").value);    
      if(this.form.get("order")) { this.display.setOrderByElement(this.form.get("order").value); }    
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
