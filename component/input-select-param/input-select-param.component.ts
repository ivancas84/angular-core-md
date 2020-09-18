import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { map } from 'rxjs/operators';

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

  options$: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.title) this.title = "Seleccione";
  }

}
