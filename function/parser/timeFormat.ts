
  //@param format (default h:i)
  //  "d/m/Y",
  export function timeFormat(value: any, format?: string): any {
    value = new Date(value);

    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){

      default:
        var h2 = value.getHours().toString();
        var i2 = value.getMinutes().toString();
        return (h2[1]?h2:"0"+h2[0]) + ":" + (i2[1]?i2:"0"+i2[0]);
    }
}