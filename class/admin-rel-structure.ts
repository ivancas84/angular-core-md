import { FieldViewOptions } from "./field-view-options";
import { FieldsetDynamicOptions } from "./fieldset-dynamic-options";

export class AdminRelStructure { //3
  id:string = null; //identificacion de la relacion
  /**
   * El identificador se define:
   * 1) Para las relaciones fk se utiliza el alias de la relación, ejemplo per, per_dom
   * 2) @todo Para las relaciones um se utiliza "alias_relacion-tabla.fk", 
   * por ejemplo si alumno M:U comision y comision U:M curso, 
   * entonces "com-comision.curso"
   */
  title?: string = null //titulo del fieldset
  fieldsViewOptions: FieldViewOptions[] = [] //array de FieldViewOptions
  data:any //datos
  
  options: FieldsetDynamicOptions = new FieldsetDynamicOptions({
    inputSearchGo:false
  });
  /**
   * Actualmente existe solo FieldsetDynamicOptions, pero posteriormente se habiliten nuevos tipos de opcion (Ej FieldsetArrayDynamicOptions)
   * Cuando existen distintos tipos de opciones, es convienente definir una clase independiente para facilitar la definicion de valores por defecto,
   * segun el juego de opciones los valores por defecto variaran
   */

  order?: {[key: string]: string};
  /**
   * Para el caso de las relaciones um, se proporciona el atributo order para facilitar la definicion del ordenamiento
   */
  
  constructor(attributes: any = []) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }

}
