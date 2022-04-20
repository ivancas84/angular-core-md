
export function encodeUriObject(o: {[index:string]:any}) {
  var ret = [];
  for(var key in o){ //Se accede al metodo display.describe() para ignorar los filtros no definidos
    if(o.hasOwnProperty(key)) ret.push(key + "=" + encodeURI(o[key]));
  }
  return ret.join("&");
}