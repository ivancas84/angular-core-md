import { AbstractControl } from "@angular/forms";
import * as moment from 'moment';

export function chosenYearHandler(control: AbstractControl, normalizedYear: moment.Moment) {
  let ctrlValue = control.value;
  ctrlValue = moment();
  /**
   * es conveniente inicializar valor, dependiendo de como se inicialize el valor original puede un string, null o DateTime en vez de un moment()
   */
  ctrlValue.year(normalizedYear.year());
  control.setValue(ctrlValue);
}