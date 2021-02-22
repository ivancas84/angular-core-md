import { FieldViewOptions } from "./field-view-options";
import { FieldsetDynamicOptions } from "./fieldset-dynamic-options";

export class AdminRelStructure {
  id:string = null; //identificacion de la relacion
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
