import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Display } from '@class/display';
import { ValidatorMsg } from '@class/validator-msg';

@Component({
  selector: 'core-input-select',
  templateUrl: './input-select.component.html',
})
export class InputSelectComponent implements  OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() field: FormControl;
  @Input() entityName: string;
  @Input() title?: string;
  @Input() multiple?: boolean = false;

  options$: Observable<Array<any>>;

  @Input() readonly?: boolean = false;
  @Input() validatorMsgs?: ValidatorMsg[] = [] //validators
  
  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.title) this.title = this.entityName;
    this.options$ = this.dd.all(this.entityName, new Display)
  }

}
