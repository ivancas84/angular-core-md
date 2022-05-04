import { Input, Component, ViewChild, OnInit } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Display } from '@class/display';
import { FormGroupConfig } from '@class/reactive-form-config';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { emptyUrl } from '@function/empty-url.function';
import { isEmptyObject } from '@function/is-empty-object.function';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsTouched } from '@function/mark-all-as-touched';

@Component({
  selector: 'core-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
 
  @Input() control!: FormGroup;
  controlParams!: FormGroup

  configParams!: FormGroupConfig
  @Input() display!: Display;
  /**
   * Busqueda a traves de condicion
   * implementacion opcional mediante componente SearchCondition
   */ 

  @Input() title: string = "Opciones"


  isSubmitted: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton aceptar
   */

  @ViewChild(MatExpansionPanel) searchPanel!: MatExpansionPanel;

  constructor(
    protected router: Router,
    protected dialog: MatDialog,
  ) {}
  

  ngOnInit(){
    if(!isEmptyObject(this.display.getParams()))
      this.control.controls["params"].reset(this.display.getParams()) 
      this.controlParams = this.control.controls["params"] as FormGroup

    // var c = this.display.getCondition()
    // if(this.config.controls.hasOwnProperty("params") && !isEmptyObject(c)){
    //    for(let i = 0; i < c.length; i++){
    //      let elFG = this.formGroup(c[i][0], c[i][1], c[i][2]);
    //      elementsFGs.push(elFG);
    //    }
    // }
  }

  onSubmit(): void {
    /**
     * Transformar valores del atributo display a traves de los valores del formulario
     */

    this.isSubmitted = true;

    if (!this.control.valid) {
      markAllAsTouched(this.control);
      logValidationErrors(this.control);
      this.dialog.open(DialogAlertComponent, {
        data: {title: "Error", message: "El formulario posee errores."}
      });
      this.isSubmitted = false;
    } else {
      if(this.control.get("condition")) this.display.setConditionByFilters(this.control.get("condition")!.value);    
      if(this.control.get("params")) this.display.setParams(this.control.get("params")!.value);    
      if(this.control.get("order")) { this.display.setOrderByElement(this.control.get("order")!.value); }    
      this.display.setPage(1);
      this.searchPanel.close();
      this.search();
    }
  }
  
  search(): void {
    /** 
     * Metodo independiente para facilitar reimplementacion 
     **/
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());  
  }
}
