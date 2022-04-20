import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';

export class InputSelectCheckboxConfig extends FormControlConfig {
  override component: any = InputSelectCheckboxComponent
  readonly: boolean = false;
  options: any[] = ["Sí", "No"];
  /**
   * El primer valor sera transformado al string "true"
   * El segundo a "false"
   */

  constructor(attributes: any = {}) {
    super({});
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-select-checkbox',
  templateUrl: './input-select-checkbox.component.html',
})
export class InputSelectCheckboxComponent implements ControlComponent, OnInit {
  /**
   * Componente select checkbox reutilizable
   */

  @Input() config!: InputSelectCheckboxConfig;
  @Input() control!: FormControl;

  ngOnInit(): void {
    if(!this.config.label) this.config.label = getControlName(this.control)
  }
}
