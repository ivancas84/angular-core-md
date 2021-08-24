import { Input, Component } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'app/core/const/MY_FORMATS';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ValidatorMsg } from '@class/validator-msg';
import { ControlComponent, FormConfig, FormControlConfig } from '@class/reactive-form-config';
import { FormControl } from '@angular/forms';

export class InputYmConfig extends FormControlConfig  {
  componentId: string = "input_ym"
  label?: string;
  placeholder?: string = "Ingrese año y mes";
  readonly?: boolean = false;
  validatorMsgs: ValidatorMsg[] = [];
  showLabel: boolean = true

  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

@Component({
  selector: 'core-input-ym',
  templateUrl: './input-ym.component.html',
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
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class InputYmComponent implements ControlComponent {
  @Input() config: InputYmConfig;
  @Input() control: FormControl;

  /**
   * Si se desea inicializar con el valor por defecto de mes y año actual
   * se debe inicializar el field: 
   *   import * as moment from 'moment';
   *   new FormControl(moment()) o field: fb.group({field: moment()}),
   */

  

  chosenYearHandler(normalizedYear: moment.Moment) {
    let ctrlValue = this.control.value;
    ctrlValue = moment();
    /**
     * es conveniente inicializar valor, dependiendo de como se inicialize el valor original puede un string, null o DateTime en vez de un moment()
     */
    ctrlValue.year(normalizedYear.year());
    this.control.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    let ctrlValue = this.control.value;
    ctrlValue.month(normalizedMonth.month());
    this.control.setValue(ctrlValue);
    datepicker.close();
  }

  clear(){
    this.control.setValue(null);
    this.control.markAsDirty();
  }
  
}
