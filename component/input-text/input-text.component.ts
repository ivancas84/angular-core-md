import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements OnInit{ //2.1

  @Input() field: FormControl
  @Input() title?: string
  @Input() placeholder?: string = ""
  @Input() uniqueRoute?: string //Ruta de administracion para valor unico (si no se define no se activa enlace)
  @Input() uniqueParam?: string = "id" 
  /**
   * Por defecto se utiliza el metodo getControlName para definir el nombre
   * CUIDADO! getControlName funciona solo si tiene padre
   */
  
  @Input() type?: string = "text"
  @Input() width?: string = null
  /**
   * Ancho exclusivo del input
   * se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
   */
  
  queryParams = {};
  uniqueValue: string;

  ngOnInit(): void {
    if(!this.uniqueRoute) return;
    this.field.statusChanges.subscribe(
      () => {
        if(this.field.hasError("notUnique")){
          this.uniqueValue = this.field.getError("notUnique");
          this.queryParams[this.uniqueParam] = this.uniqueValue;
        }
      }
    );
    
  }

}
