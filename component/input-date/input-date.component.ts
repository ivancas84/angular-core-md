import { Input, Component, Type, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'app/core/const/DATE_FORMATS';
import { ControlComponent, FormConfig, FormControlConfig } from '@class/reactive-form-config';
import { FormControl } from '@angular/forms';

export class InputDateConfig extends FormControlConfig {
  componentId: string = "input_date"
  title?: string;
  placeholder?: string = "Seleccione fecha";
  readonly?: boolean = false;
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
export class InputDateComponent implements ControlComponent {
  @Input() config: FormConfig;
  @Input() control: FormControl;


}
