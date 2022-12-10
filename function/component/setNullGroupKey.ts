import { FormGroup } from "@angular/forms";

export function setNullGroupKey(group: FormGroup, key: string): void {
  group.controls[key].setValue(null)
}

