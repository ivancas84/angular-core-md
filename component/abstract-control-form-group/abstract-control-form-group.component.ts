import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldWidthOptions } from '@class/field-width-options';
import { ControlComponent, FormControlConfig, FormGroupConfig } from '@class/reactive-form-config';

@Component({
  selector: 'core-abstract-control-form-group',
  templateUrl: './abstract-control-form-group.component.html',
  styles:[`
    .item { padding:0px 10px;  }
  `]
})
export class AbstractControlFormGroupComponent implements ControlComponent, OnInit {
  @Input() config!: FormGroupConfig;
  @Input() control!: FormGroup;

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


