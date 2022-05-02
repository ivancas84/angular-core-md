import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormControlConfig } from '@class/reactive-form-config';

export class InputSelectLabelConfig extends FormControlConfig {
  override component:any = InputSelectLabelComponent
  options!: any[]; 
  override label: string = "Seleccione";
  readonly?: boolean = false;

  constructor(attributes: any = {}) {
    super();
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-select-label',
  templateUrl: './input-select-label.component.html',
})
export class InputSelectLabelComponent {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() config!: InputSelectLabelConfig;
  @Input() control!: FormControl;

  options$!: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }


}
