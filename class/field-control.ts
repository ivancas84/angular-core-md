import { FieldConfig } from "./field-config";

export class FieldControl extends FieldConfig {
  options?: any;
  validators?: any[];
  asyncValidators?: any[];
  default?: any = null; //valor por defecto
}
