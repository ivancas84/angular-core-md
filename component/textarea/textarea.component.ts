import { Input, Component, Type, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';

export class TextareaConfig extends FormControlConfig {
  component: any = TextareaComponent
  label?: string;
  placeholder: string = "";
  readonly: boolean = false;

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-textarea',
  templateUrl: './textarea.component.html',
})
export class TextareaComponent implements ControlComponent, OnInit {
  @Input() config: TextareaConfig;
  @Input() control: FormControl;

  ngOnInit(){
    if(!this.config.label) this.config.label = getControlName(this.control)
  }
}
