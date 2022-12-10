import { AbstractControl } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { chosenYearHandler } from "@function/component/chosenYearHandler";

export function chosenYearHandlerClose(control: AbstractControl, normalizedYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>){
  chosenYearHandler(control,normalizedYear)
  datepicker.close();
}