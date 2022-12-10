import { FormGroup } from "@angular/forms";

export function setValueGroupKey(group: FormGroup, key: string, value: any): void {
  group.controls[key].setValue(value)
}

