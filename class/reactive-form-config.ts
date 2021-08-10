import { FormControl, FormGroup } from "@angular/forms"
import { FieldDefaultOptions, FieldViewOptions } from "./field-type-options"
import { FieldWrapOptions } from "./field-wrap-options"
import { FieldWidthOptions } from "./field-width-options"
import { ValidatorMsg } from "./validator-msg"
import { KeyValue } from "@angular/common"

export class FormConfig {
  id: string
  position: number = 0
  validatorMsgs: ValidatorMsg[] = []
  default: any = null

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


export interface SortControl {
  position: number;
}


export class FormControlsConfig extends FormConfig {
  controls: { [index: string]: FormConfig }
  sort = (a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0)
  }
  
  constructor(attributes: any) {
    super({})
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  } 
}


export interface FormGroupFactory{
  formGroup(): FormGroup
}

export class FormGroupConfig extends FormControlsConfig {
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

export class FormStructureConfig extends FormGroupConfig {
  /**
   * Clase especial que permite identificar una estructura principal
   */
  controls: { [index: string]: FormGroupConfig | FormArrayConfig }

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
  field?: FormControl = null

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FormArrayConfig extends FormControlsConfig {
  id: string = "form_array"
  factory: FormGroupFactory //es necesario definir una clase concreta de FormGroupFactory que permita definir el FormGroup del FormArray
  order?: {[key: string]: string} //ordenamiento por defecto para realizar la consulta
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
  label: string = null //etiqueta
  wrap?: FieldWrapOptions | FieldWrapOptions[] //envolturas
  /**
   * Si se utiliza un array se aplican las envolturas en el orden de definicion
   */

  type: FieldViewOptions = new FieldDefaultOptions()
  showLabel: boolean = false //indica si debe mostrarse el label o no
  /**
   * no siempre se puede indicar label = null para esconder el label
   */

  readonly: boolean = false
  placeholder: string = null
  width:FieldWidthOptions = new FieldWidthOptions(); //ancho del contenedor

  constructor(attributes: any = {}) {
    super({})
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

