import { MONTH_NAMES } from '@config/core/const/MONTH_NAMES';

export class Parser {

  static date(value: string): Date {
    if(!value) return null;

    switch(value){
      case null: return null;

      case "CURRENT_TIME": case "CURRENT_DATE": case "CURRENT_TIMESTAMP":
        var date: Date = new Date();
        //return date;
        return new Date(date.getTime())
        // + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)

      default:
        var date = new Date(value);
        //return date;
        return new Date(date.getTime())
        // + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)
    }
  }

  static time(value: string): Date {
    if(!value) return null;

    switch(value){
      case null: return null;

      case "CURRENT_TIME": case "CURRENT_DATE": case "CURRENT_TIMESTAMP":
        var date: Date = new Date();
        //return date;
        return new Date(date.getTime())
        // + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)

      default:
        var dateAux = new Date();
        var date = new Date(this.dateFormat(dateAux) + " " + value);

        //return date;
        return new Date(date.getTime())
        // + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)
    }
  }

  //@param format (default Y-m-d)
  //  "d/m/Y",
  //  "NgbDateStruct": Retorna un objeto {day:number, month:number, year:number}, inspirado en el datepicker de bootstrap
  static dateFormat(value: Date, format: string = null): any {
    if(!(value instanceof Date)) return null;

    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){
      case "F": return MONTH_NAMES[value.getMonth()];

      case "d/m/Y":
        var yyyy = value.getFullYear().toString();
        var mm = (value.getMonth()+1).toString();
        var dd  = value.getDate().toString();
        return (dd[1]?dd:"0"+dd[0]) + "/" + (mm[1]?mm:"0"+mm[0]) + "/" + yyyy;


      case "NgbDateStruct":
        var yyyy2 = value.getFullYear();
        var mm2 = value.getMonth()+1;
        var dd2  = value.getDate();
        return {day:dd2, month:mm2, year:yyyy2};

      default:
        var yyyy3 = value.getFullYear().toString();
        var mm3 = (value.getMonth()+1).toString();
        var dd3  = value.getDate().toString();
        return yyyy3 + "-" + (mm3[1]?mm3:"0"+mm3[0]) + "-" + (dd3[1]?dd3:"0"+dd3[0]);
      }
  }


  static timestamp(value: string): Date {
    let date: Date = null;
    let time_ = null;
    let time = null;

    switch(value){
      case null: return null;

      case "CURRENT_TIME": case "CURRENT_DATE": case "CURRENT_TIMESTAMP":
        date = new Date();
        date.setSeconds(0);
        return date;
        //return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

      default:
        date = new Date(value);
        time_ = value.split(" ");
        time = time_[1].split(":");

        date.setHours(Number(time[0]));
        date.setMinutes(Number(time[1]));
        date.setSeconds(0);
        return date;
        //return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  }


  //@param format (default h:i)
  //  "d/m/Y",
  //  "NgbTimeStruct": Retorna un objeto {hour:number, minute:number}, inspirado en el datepicker de bootstrap
  static timeFormat(value: Date, format: string = null): any {
    if(!(value instanceof Date)) return null;


    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){

      default:
        var h2 = value.getHours().toString();
        var i2 = value.getMinutes().toString();
        return (h2[1]?h2:"0"+h2[0]) + ":" + (i2[1]?i2:"0"+i2[0]);
    }
}

  //@param format (default Y-m-d)
  //  "d/m/Y",
  //  "NgbDateTimeStruct": Retorna un objeto compuesto {day:number, month:number, year:number} {hour:number, minute:number}, inspirado en el datepicker y timepicker de bootstrap
  static timestampFormat(value: Date, format: string = null): any {
    if(!(value instanceof Date)) return null;

    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){
      case "d/m/Y h:i":
        var d = this.dateFormat(value, "d/m/Y");
        var t = this.timeFormat(value, "h:i");
        return d + " " + t;

      default:
        var d = this.dateFormat(value);
        var t = this.timeFormat(value);
        return d + " " + t;
    }
  }

}
