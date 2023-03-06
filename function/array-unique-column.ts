import { arrayColumn } from "./array-column";
import { arrayUnique } from "./array-unique";

export function arrayUniqueColumn(array: any[], field_name:string){
  return arrayUnique(
    arrayColumn(array, field_name).filter(function (el) { return el != null; })
  );
}



