import { Input, OnInit, Component, Type } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Display } from '@class/display';
import { ControlComponent, FormConfig, FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';

export class InputSelectConfig extends FormControlConfig{
  componentId: string = "input_select"
  entityName: string;
  label?: string = "Seleccione";
  multiple: boolean = false;
  readonly: boolean = false;

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

  @Input() config: InputSelectConfig;
  @Input() control: FormControl;

  options$: Observable<Array<any>>;
  
  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.config.label) this.config.label = getControlName(this.control);
    if(!this.config.entityName) this.config.entityName = getControlName(this.control);
    
    this.options$ = this.dd.all(this.config.entityName, new Display)
  }

}
