import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Display } from '@class/display';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';

export class InputSelectConfig extends FormControlConfig{
  override component: any = InputSelectComponent
  entityName!: string
  multiple: boolean = false
  readonly: boolean = false

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-select',
  templateUrl: './input-select.component.html',
})
export class InputSelectComponent implements ControlComponent, OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() config!: InputSelectConfig;
  @Input() control!: FormControl;

  options$!: Observable<Array<any>>;
  
  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    var n = "";
    if(!this.config.label) {
      n = getControlName(this.control)
      this.config.label = titleCase(n.substring(n.indexOf("-")+1).replace("_"," "))
    }
    
    if(!this.config.entityName) {
      if(!n.length) var n = getControlName(this.control)
      this.config.entityName = n.substring(n.indexOf("-")+1)
    }

    this.options$ = this.dd.all(this.config.entityName, new Display)
  }

}
