import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';

@Component({
  selector: 'core-input-checkbox',
  templateUrl: './input-checkbox.component.html',
})
export class InputCheckboxComponent implements OnInit {
  /**
   * Checbox no admite placeholder, error unique, error require.
   * Se define por defecto un error general que puede ser validado como further_error
   */
  @Input() field: FormControl;
  @Input() title?: string;
  @Input() titleDisabled?: boolean = false;
  /**
   * Para facilitar la incorporacion dinamica de componentes
   * se incluye el flag showTitle, para aquellos casos especiales
   * donde se necesita definir un title pero no se desea mostrar.
   * Por ejemplo cuando se utilizar un checkbox 
   * como celda de una columna
   * en una tabla dinamica
   */

  ngOnInit(): void {
    if(!this.title) this.title = getControlName(this.field)
  }
   
}
