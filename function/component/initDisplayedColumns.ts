import { FormGroup } from "@angular/forms";

export function initDisplayedColumns(formGroup: FormGroup) {
  return Object.keys(formGroup.controls)
}