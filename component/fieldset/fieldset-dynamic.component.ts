import { KeyValue } from '@angular/common';
import { Component, Input, OnInit, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldWidthOptions } from '@class/field-width-options';
import { ControlComponent, FormConfig, FormControlConfig, FormGroupConfig } from '@class/reactive-form-config';

export class FieldsetDynamicConfig extends FormGroupConfig {
  componentId:string = "fieldset"
  controls: { [index: string]: FormControlConfig }
  title?: string;
  entityName?: string;
  intro?: string;
  optTitle: FormConfig[] = []; //opciones de titulo

  constructor(attributes: any = {}, controls:{ [index: string]: FormConfig } = {}) {
    super({}, controls)
    Object.assign(this, attributes)
  }
}


@Component({
  selector: 'core-fieldset-dynamic',
  templateUrl: './fieldset-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
  `]
})
export class FieldsetDynamicComponent implements ControlComponent, OnInit {
  
  @Input() config: FormGroupConfig;
  @Input() control: FormGroup;

  sort = (a: KeyValue<string,FormControlConfig>, b: KeyValue<string,FormControlConfig>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0)
  }

  ngOnInit(): void {
    for(var i in this.config.controls){
      if(this.config.controls.hasOwnProperty(i)) {
        if(!this.config.controls[i]["width"]) this.config.controls[i]["width"] = new FieldWidthOptions
      } 
    }
  }


}


