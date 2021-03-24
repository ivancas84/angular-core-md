import { Input, OnInit, Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';

@Component({
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements OnInit{

  @Input() field: FormControl
  @Input() title?: string
  @Input() placeholder?: string = ""
  @Input() uniqueRoute?: string //Ruta de administracion para valor unico (si no se define no se activa enlace)
  @Input() uniqueParam?: string 
  /**
   * Por defecto se utiliza el metodo getControlName para definir el nombre
   *  getControlName funciona solo si tiene padre
   */
  
  @Input() type?: string = "text"
  @Input() width?: string = null
  /**
   * Ancho exclusivo del input
   * se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
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
