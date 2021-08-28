import { AbstractControl, FormControl, FormGroup } from "@angular/forms"
import { ValidatorMsg } from "./validator-msg"
import { Type } from "@angular/core"

export interface ControlComponent {
  config:FormConfig
  control:AbstractControl
}

export class FormConfig {
  parent:FormConfig = null
  componentId:string
  controlId: string
  position: number = 0
  validatorMsgs: ValidatorMsg[] = []
  default:any = null
  component: Type<any>
  [key: string]: any

  constructor(attributes: any = {}) {
    Object.assign(this, attributes)
  }
}

export interface FormGroupFactory{
  formGroup(): FormGroup
}

export class ConfigFormGroupFactory implements FormGroupFactory{
  config: FormGroupConfig

  public constructor(config: FormGroupConfig){
    this.config = config;
  }

  formGroup(): FormGroup {
    var fg = new FormGroup({});
    
    for(var key in this.config.controls) {
      if(this.config.controls.hasOwnProperty(key)) fg.addControl(key, new FormControl(this.config.controls[key].default))
    }

    return fg;
  }

}

export interface SortControl {
  position: number;
}

export class FormControlsConfig extends FormConfig {
  //@todo es posible eliminar el sort
  controls: { [index: string]: FormConfig } = {}
  
  contains(key: string){ return this.controls.hasOwnProperty(key) }

  get(key){ return this.controls[key]  }

  addControl(key: string, control: FormConfig){
    control.parent = this
    this.controls[key] = control
  }

  setControls(controls: { [index: string]: FormConfig }){
    for(var key in controls) this.addControl(key, controls[key])
  }
  
  constructor(attributes: any = {}, controls:{ [index: string]: FormConfig } = {}) {
    super(attributes)
    if(controls) this.setControls(controls)
  }
}

export class FormGroupConfig extends FormControlsConfig {
  controlId: string = "form_group"
}

export class FormStructureConfig extends FormGroupConfig {
  /**
   * Clase especial que permite identificar una estructura principal
   */
  controls: { [index: string]: FormGroupConfig | FormArrayConfig }

  constructor(attributes: any = {},controls:{ [index: string]: FormGroupConfig | FormArrayConfig } = {}) {
    super(attributes, controls)
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
  
}




export class FormWrapConfig extends FormControlConfig {
  controlId: string = "form_control"
  config: FormControlConfig
}

export class NoComponentConfig extends FormConfig {

}
