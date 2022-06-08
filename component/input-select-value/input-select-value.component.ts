import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { map, tap } from 'rxjs/operators';
import { FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';

export class InputSelectValueConfig extends FormControlConfig {
  override component: any = InputSelectValueComponent
  readonly: boolean = false;
  multiple: boolean = false;
  entityName!: string
  fieldName!: string
  
  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}

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

  @Input() control!: FormControl;
  @Input() config!: InputSelectValueConfig;

  options$!: Observable<Array<any>>;

  constructor( public dd: DataDefinitionService ) { }

  ngOnInit(): void {
    var n = "";
    if(!this.config.label) {
      n = getControlName(this.control)
      this.config.label = titleCase(n!.substring(n!.indexOf("-")+1).replace("_"," "))
    }

    if(!this.config.fieldName) this.config.fieldName = getControlName(this.control)

    let display  = new Display();
    display.setFieldsArray([this.config.fieldName]);
    display.setOrderByKeys([this.config.fieldName]);
    this.options$ = this.dd.post("advanced", this.config.entityName, display).pipe(
      map(
        rows => arrayColumn(rows, this.config.fieldName).filter(n => n)
      ),
    )
  }

}
