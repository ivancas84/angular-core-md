import { AbstractControl, FormGroup } from "@angular/forms"
import { ValidatorMsg } from "./validator-msg"
import { Type } from "@angular/core"

export interface ControlComponent {
  config:FormConfig
  control:AbstractControl
}

export class FormConfig {
  componentId:string
  controlId: string
  position: number = 0
  validatorMsgs: ValidatorMsg[] = []
  default:any = null
  component: Type<any>
  [key: string]: any

  constructor(attributes: any = {}) {
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
  
  contains(key: string){
    return this.controls.hasOwnProperty(key)
  }
  
  constructor(attributes: any = {}) {
    super(attributes)
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
  controlId: string = "form_group"
}

export class FormStructureConfig extends FormGroupConfig {
  /**
   * Clase especial que permite identificar una estructura principal
   */
  controls: { [index: string]: FormGroupConfig | FormArrayConfig }

  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class AbstractControlOption {
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

/*
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
}*/

export class FormArrayConfig extends FormControlsConfig {
  controlId: string = "form_array"
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

   constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FormControlConfig extends FormConfig {
  controlId: string = "form_control"

  // label: string = null //etiqueta
  //wrap?: FieldWrapOptions | FieldWrapOptions[] //envolturas
  // /**
  //  * Si se utiliza un array se aplican las envolturas en el orden de definicion
  //  */

  //type: FieldViewOptions = new FieldDefaultOptions()
  // showLabel: boolean = true //indica si debe mostrarse el label o no

  // readonly: boolean = false
  // placeholder: string = null
  // width:FieldWidthOptions = new FieldWidthOptions() //ancho del contenedor
  
  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}




export class FormWrapConfig extends FormControlConfig {
  controlId: string = "form_control"
  config: FormControlConfig

  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class NoComponentConfig extends FormConfig {

  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
