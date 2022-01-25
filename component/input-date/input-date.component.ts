import { Input, Component, Type, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'app/core/const/DATE_FORMATS';
import { ControlComponent, FormConfig, FormControlConfig } from '@class/reactive-form-config';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';

export class InputDateConfig extends FormControlConfig {
  componentId: string = "input_date"
  label?: string;
  placeholder: string = "Seleccione fecha";
  readonly: boolean = false;
}

@Component({
  selector: 'core-input-date',
  templateUrl: './input-date.component.html',
  styles:[`
    mat-datepicker-toggle {
      display: inline-block;
  }
  `],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
  ]
})
export class InputDateComponent implements ControlComponent, OnInit {
  
  @Input() config: FormConfig;
  @Input() control: FormControl;

  ngOnInit(): void {
    if(!this.config.label) {
      var n = getControlName(this.control)
      this.config.label = titleCase(n.substring(n.indexOf("-")+1).replace("_"," "))
    }
  }
}
