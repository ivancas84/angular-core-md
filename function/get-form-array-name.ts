import { AbstractControl } from '@angular/forms';

export function getFormArrayName(c: AbstractControl, index:number): string {
  if(c.parent && c.parent.parent){
    const formArray: {[key:string]: any} = c.parent.parent.controls ;
    return Object.keys(formArray).find(name => c === formArray[name].controls[index]) || "";
  }
  return ""
}