import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';

@Component({
  selector: 'core-input-textarea',
  templateUrl: './input-textarea.component.html',
})
export class InputTextareaComponent implements OnInit { //2
  @Input() field: FormControl;
  @Input() title?: string;
  @Input() placeholder?: string = "";
  @Input() uniqueRoute?: string //Ruta de administracion para valor unico
  /**
   * si no se define no se activa enlace
   */

  @Input() uniqueParam?: string 
  /**
   * Por defecto se utiliza el metodo getControlName para definir el nombre
   *  getControlName funciona solo si tiene padre
   */

  queryParams = {};

  ngOnInit(): void {
      if(!this.uniqueRoute) return;
      if(!this.uniqueParam) this.uniqueParam = getControlName(this.field)
      if(this.uniqueParam) this.field.valueChanges.subscribe(
        value => {
          this.queryParams[this.uniqueParam] = value;
        }
      )
  

  }
  
}
