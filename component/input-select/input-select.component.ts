import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { Display } from '../../class/display';
import { tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-input-select',
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
  @Input() readonly?: boolean = false;

  options$: Observable<Array<any>>;

  options: any;
  
  disabled: boolean = true;

  protected subscriptions = new Subscription();

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    this.options$ = this.dd.all(this.entityName, new Display)
  }

}
