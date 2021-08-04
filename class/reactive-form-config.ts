import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { FieldDefaultOptions, FieldViewOptions } from "./field-type-options";
import { RouterLinkOptions, InputPersistOptions } from "./field-view-aux-options";
import { FieldWidthOptions } from "./field-width-options";
import { ValidatorMsg } from "./validator-msg";
import { ComponentOptions } from "./component-options";
import { KeyValue } from "@angular/common";
import { SortControl } from "./reactive-form-ext";

export class FormConfig {
  id: string;

  position: number = 0;

  validatorMsgs: ValidatorMsg[] = []

  controls: { [index: string]: FormConfig }

  default: any = null;

  options?: ComponentOptions; //opciones especificas del componente

  sort = (a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0);
  }
  
  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  } 
}

export interface FormGroupFactory{
  formGroup(): FormGroup;
}

export class FormGroupConfig extends FormConfig {
  id: string = "form_group"

  constructor(attributes: any) {
    super({})
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FormControlOption {
  config: FormControlConfig
  field: FormControl

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FormArrayConfig extends FormConfig {
  id: string = "form_array"
  
  factory: FormGroupFactory //es necesario definir una clase concreta de FormGroupFactory que permita definir el FormGroup del FormArray
  
  order?: {[key: string]: string}; //ordenamiento por defecto para realizar la consulta
  /**
   * @example {motivo:"asc", per-nombres:"desc"}
   */

  default: any = []

  constructor(attributes: any) {
    super({})
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FormControlConfig extends FormConfig {
  id: string = "form_control"

  label?: string = null //etiqueta campo

  aux?: RouterLinkOptions | InputPersistOptions = null; //opciones para field-view-aux
  
  type?: FieldViewOptions = new FieldDefaultOptions()

  showLabel: boolean = false; //indica si debe mostrarse el label o no
    /**
     * no siempre se puede indicar label = null para esconder el label
     */
  
  readonly?: boolean = false

  placeholder: string = null
   
  width?:FieldWidthOptions = new FieldWidthOptions(); //ancho del contenedor

  constructor(attributes: any) {
    super({})
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

