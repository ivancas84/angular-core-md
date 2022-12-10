import { FormControl } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";

export function chosenMonthHandler(control: FormControl, normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
  let ctrlValue = control.value;
  ctrlValue.month(normalizedMonth.month());
  control.setValue(ctrlValue);
  datepicker.close();
}
