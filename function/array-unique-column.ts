import { arrayColumn } from "./array-column";
import { arrayUnique } from "./array-unique";

export function arrayUniqueColumn(array: any[], fieldName:string){
  return arrayUnique(
    arrayColumn(array, fieldName).filter(function (el) { return el != null; })
  );
}



