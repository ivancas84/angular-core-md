export function prefixObj(obj, prefix) {
  /**
   * Agregar prefijo a la primer rama de un objeto
   */
  var newObj = {}
  for(var x in obj){
    if(obj.hasOwnProperty(x))
      newObj[prefix+x] = obj[x]
  }

  return newObj;
}