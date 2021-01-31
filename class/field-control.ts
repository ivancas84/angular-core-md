import { FieldConfig } from "./field-config";

export class FieldControl extends FieldConfig {
  options?: any = null;
  validators?: any[];
  asyncValidators?: any[];
  default?: any = null; //valor por defecto
  adminRoute?: string = null;
  uniqueRoute?: string = null;
  disabled?: boolean = false;

  constructor(attributes: any) {
    super(attributes);
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
