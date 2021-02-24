import { FieldViewOptions } from "./field-view-options";
import { FieldsetDynamicOptions } from "./fieldset-dynamic-options";

export class AdminRelStructure {
  id:string = null; //identificacion de la relacion
  /**
   * Para facilitar el armado de las relaciones, 
   * evitar el recorrido del arbol,
   * y hacer mas eficiente el calculo:
   * El identificador se define:
   * 1) Para las relaciones fk, "relacion-fk",
   * por ejemplo si alumno M:U persona con alumno.persona, entonces "per-persona"
   * 2) Para las relaciones um, "relacion-tabla.fk", 
   * por ejemplo si alumno M:U comision y comision U:M curso, entonces "com-comision.curso"
   * Nota: La cadena de las relaciones U:M puede tener hasta una profundidad
   */
  title?: string = null //titulo del fieldset
  fieldsViewOptions: FieldViewOptions[] = [] //array de FieldViewOptions
  data:any //datos
  fieldsetOptions: FieldsetDynamicOptions = new FieldsetDynamicOptions({inputSearchGo:false});
  
  constructor(attributes: any = []) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }

}
