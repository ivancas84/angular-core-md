import { Input, OnInit, Component} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Display } from '@class/display';

@Component({
  selector: 'core-search-params',
  template: '',
})
export abstract class SearchParamsComponent implements OnInit { //1.1
  /**
   * Componente anidado para definir busqueda a traves de parametros 
   */

  @Input() form: FormGroup; //formulario 
  @Input() display: Display; //Datos de busqueda
  fieldset: FormGroup; //fieldset

  constructor( protected fb: FormBuilder ) { }

  abstract formGroup();

  ngOnInit() {
    /**
     * Inicializar datos
     * Los valores por defecto se definen en el componente principal 
     * que utiliza el formulario de busqueda
     * a traves del atributo display
     */  
    this.fieldset = this.formGroup();
    if(!isEmptyObject(this.display.getParams())) { this.fieldset.reset(this.display.getParams()) }
    this.form.addControl("params", this.fieldset);
  }
 
}
