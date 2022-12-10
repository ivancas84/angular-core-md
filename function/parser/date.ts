export function date(value: string): Date | undefined {
  if(!value) return;

  switch(value){
    case null: return;

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
