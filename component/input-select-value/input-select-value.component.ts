import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { map } from 'rxjs/operators';

@Component({
  selector: 'core-input-select-value',
  templateUrl: './input-select-value.component.html',
})
export class InputSelectValueComponent implements OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() field: FormControl;
  @Input() entityName: string;
  @Input() fieldName: string;
  @Input() title?: string;

  options$: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    if(!this.title) this.title = this.fieldName;
    let display  = new Display();
    display.setFields([this.fieldName]);
    display.setOrderByKeys([this.fieldName]);
    this.options$ = this.dd.post("advanced", this.entityName, display).pipe(
      map(
        rows => arrayColumn(rows, this.fieldName)
      )
    )
  }

}
