import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';
import { startWith, Subscription } from 'rxjs';

export class InputSelectCheckboxConfig extends FormControlConfig {
  override component: any = InputSelectCheckboxComponent
  readonly: boolean = false;
  options: any[] = ["Sí", "No"];
  /**
   * El primer valor sera transformado al string "true"
   * El segundo a "false"
   */

  constructor(attributes: any = {}) {
    super();
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-select-checkbox',
  templateUrl: './input-select-checkbox.component.html',
})
export class InputSelectCheckboxComponent implements OnInit,OnDestroy {
  
  /**
   * Componente select checkbox reutilizable
   */

  @Input() config!: InputSelectCheckboxConfig;
  @Input() control!: FormControl;

  protected subscriptions = new Subscription() //suscripciones en el ts
  ngOnInit(): void {
    if(!this.config.label) {
      var n = getControlName(this.control)
      this.config.label = titleCase(n!.substring(n!.indexOf("-")+1).replace("_"," "))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
  
}
