export function prefixObj(obj: { [x: string]: any }, prefix: string) {
  /**
   * Agregar prefijo a la primer rama de un objeto
   */
  var newObj: { [x: string]: any } = {}
  for(var x in obj){
    if(obj.hasOwnProperty(x))
      newObj[prefix+x] = obj[x]
  }

  return newObj;
}