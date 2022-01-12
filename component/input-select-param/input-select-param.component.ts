import { Input, OnInit, Component, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { FormControl } from '@angular/forms';

export class InputSelectParamConfig extends FormControlConfig {
  componentId: string = "input_select_param"
  options: any[];
  label?: string;
  readonly: boolean = false;
  multiple: boolean = false;

  constructor(attributes: any = {}) {
    super(attributes)
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-select-param',
  templateUrl: './input-select-param.component.html',
})
export class InputSelectParamComponent implements ControlComponent, OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() config: InputSelectParamConfig;
  @Input() control: FormControl;

  options$: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.config.label) this.config.label = "Seleccione";
  }

}
