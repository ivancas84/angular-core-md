import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ValidatorMsg } from '@class/validator-msg';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';

export class InputSelectLabelConfig extends FormControlConfig {
  component:any = InputSelectLabelComponent
  options: any[]; 
  label?: string = "Seleccione";
  readonly?: boolean = false;
  validatorMsgs: ValidatorMsg[] = [];

  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

@Component({
  selector: 'core-input-select-label',
  templateUrl: './input-select-label.component.html',
})
export class InputSelectLabelComponent implements ControlComponent {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() config: InputSelectLabelConfig;
  @Input() control: FormControl;

  options$: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }


}
