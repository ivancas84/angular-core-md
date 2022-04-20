import { AbstractControl, FormGroup } from '@angular/forms';

export function getControlName(c: AbstractControl): string {
  if(c.parent){
    const formGroup: {[key:string]: any} = c.parent.controls ;
    return Object.keys(formGroup).find(name => c === formGroup[name]) || "";
  }
  return ""
}