import { AbstractControl, FormControl, FormGroup } from "@angular/forms"
import { FieldDefaultOptions, FieldViewOptions } from "./field-type-options"
import { FieldWrapOptions } from "./field-wrap-options"
import { FieldWidthOptions } from "./field-width-options"
import { ValidatorMsg } from "./validator-msg"
import { KeyValue } from "@angular/common"
import { AbstractControlViewOptions, StructureViewOptions } from "./abstract-control-view-options"

export class FormConfig {
  id: string
  position: number = 0
  validatorMsgs: ValidatorMsg[] = []
  default:any = null

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
  //@todo es posible eliminar el sort
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

export class AbstractControlOption {
  viewOptions: AbstractControlViewOptions
  config?: FormConfig
  control?: AbstractControl

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FormControlOption extends AbstractControlOption {
  config: FormControlConfig 
  field?: FormControl = null

  constructor(attributes: any) {
    super(attributes)
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
  default:any = []
  /**
   *  NO SE RECOMIENDA DEFINIR VALORES POR DEFECTO PARA FORM ARRAY, 
   * para cada fila se utilizaran los valores por defecto definidos en la configuracion de formgroup
   */

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
  showLabel: boolean = true //indica si debe mostrarse el label o no

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

