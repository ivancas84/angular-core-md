import { FieldViewOptions } from "./field-view-options";
import { FieldsetDynamicOptions } from "./fieldset-dynamic-options";

export class AdminRelStructure { //v1.0.1
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
  fieldsetOptions: FieldsetDynamicOptions = new FieldsetDynamicOptions({
    inputSearchGo:false
  });
  
  constructor(attributes: any = []) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }

}
