import { Input, OnInit, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';

export class InputSelectParamConfig extends FormControlConfig {
  override component: any = InputSelectParamComponent
  options!: any[];
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

  @Input() config!: InputSelectParamConfig;
  @Input() control!: FormControl;

  options$!: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.config.label) {
      var n = getControlName(this.control)
      this.config.label = titleCase(n.substring(n.indexOf("-")+1).replace("_"," "))
    }
  }

}
