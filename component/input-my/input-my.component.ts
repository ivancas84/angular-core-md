import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'app/core/const/MY_FORMATS';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'core-input-my',
  templateUrl: './input-my.component.html',
  providers: [{
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class InputMyComponent {
  /**
   * Si se desea inicializar con el valor por defecto de mes y año actual
   * se debe inicializar el field: 
   *   import * as moment from 'moment';
   *   new FormControl(moment()) o field: fb.group({field: moment()}),
   */

  @Input() field: FormControl;
  @Input() title?: string;

  chosenYearHandler(normalizedYear: moment.Moment) {
    let ctrlValue = this.field.value;
    if(!ctrlValue) ctrlValue = moment();
    ctrlValue.year(normalizedYear.year());
    this.field.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    let ctrlValue = this.field.value;
    if(!ctrlValue) ctrlValue = moment();
    ctrlValue.month(normalizedMonth.month());
    this.field.setValue(ctrlValue);
    datepicker.close();
  }
  
}
