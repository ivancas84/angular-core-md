import { AbstractControl } from '@angular/forms';

export function getControlName(c: AbstractControl): string | null {
  const formGroup = c.parent.controls;
  return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
}