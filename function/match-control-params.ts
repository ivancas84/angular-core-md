import { FormGroup } from '@angular/forms';
import { fastClone } from './fast-clone';

export function matchParams(params: any, form:FormGroup){
  /**
   * Se realiza una traduccion del atributo params que contienen {{key}}
   */

  var p = fastClone(params)
  for(var i in p){
    if(p.hasOwnProperty(i)){
      var key: string = p[i].match(/\{\{(.*?)\}\}/)
      if(key) {
        if(!form.controls[key[1]].value) return null; //si no hay coincidencia de parametros se retorna null?
        p[i] = form.controls[key[1]].value;
      }
    }
  }
  return p;
}
