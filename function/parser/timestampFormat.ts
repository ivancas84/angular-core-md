//@param format (default Y-m-d)
  //  "d/m/Y",

import { dateFormat } from "./dateFormat";
import { timeFormat } from "./timeFormat";

  //  "NgbDateTimeStruct": Retorna un objeto compuesto {day:number, month:number, year:number} {hour:number, minute:number}, inspirado en el datepicker y timepicker de bootstrap
  export function timestampFormat(value: Date, format?: string): any {
    if(!(value instanceof Date)) return null;

    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){
      case "d/m/Y h:i":
        var d = dateFormat(value, "d/m/Y");
        var t = timeFormat(value, "h:i");
        return d + " " + t;

      default:
        var d = dateFormat(value);
        var t = timeFormat(value);
        return d + " " + t;
    }
  }