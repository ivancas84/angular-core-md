import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { AsyncValidatorOpt, ValidatorOpt } from '@class/validator-opt';

@Component({
  selector: 'core-input-select-param',
  templateUrl: './input-select-param.component.html',
})
export class InputSelectParamComponent implements OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() field: FormControl;
  @Input() options: any[];
  @Input() title?: string;
  @Input() readonly?: boolean = false;
  @Input() validatorOpts?: ValidatorOpt[] = [] //validators
  @Input() asyncValidatorOpts?: AsyncValidatorOpt[] = [] //validators

  options$: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.title) this.title = "Seleccione";
  }

}
