import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Component({
  selector: 'core-input-select-checkbox',
  templateUrl: './input-select-checkbox.component.html',
})
export class InputSelectCheckboxComponent implements OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() field: FormControl;
  @Input() options: any[] = ["Sí", "No"];
  /**
   * El primer valor sera transformado al string "true"
   * El segundo a "false"
   */
  @Input() title?: string;

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.title) this.title = "Seleccione";
  }

  isEven(n){
    return n % 2 == 0;
  }
}
