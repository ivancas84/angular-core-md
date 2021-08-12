import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ValidatorMsg } from '@class/validator-msg';

@Component({
  selector: 'core-input-select-label',
  templateUrl: './input-select-label.component.html',
})
export class InputSelectLabelComponent implements OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() field: FormControl;
  @Input() options: any[]; 
  @Input() title?: string;
  @Input() readonly?: boolean = false;
  @Input() validatorMsgs: ValidatorMsg[] = [];

  options$: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.title) this.title = "Seleccione";
  }

}
