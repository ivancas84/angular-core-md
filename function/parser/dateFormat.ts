
 //@param format (default Y-m-d)

import { MONTH_NAMES } from "@config/core/const/MONTH_NAMES";

  //  "d/m/Y",
  export function dateFormat(value:any, format?: string): string {
    value = new Date(value);

    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){
      case "F": return MONTH_NAMES[value.getMonth()];

      case "d/m/Y":
        var yyyy = value.getFullYear().toString();
        var mm = (value.getMonth()+1).toString();
        var dd  = value.getDate().toString();
        return (dd[1]?dd:"0"+dd[0]) + "/" + (mm[1]?mm:"0"+mm[0]) + "/" + yyyy;

      case "Y":
        return value.getFullYear().toString();

      default:
        var yyyy3 = value.getFullYear().toString();
        var mm3 = (value.getMonth()+1).toString();
        var dd3  = value.getDate().toString();
        return yyyy3 + "-" + (mm3[1]?mm3:"0"+mm3[0]) + "-" + (dd3[1]?dd3:"0"+dd3[0]);
      }
  }

