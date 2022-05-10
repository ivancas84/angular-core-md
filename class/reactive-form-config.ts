import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms"
import { ValidatorMsg } from "./validator-msg"
import { isEmptyObject } from "@function/is-empty-object.function"


export abstract class FormConfig {
  /**
   * Configuracion de formulario
   */
  parent?:FormConfig
  
}

export interface FormGroupFactory{
  /**
   * Fabrica de FormGroups
   * Utilizada principalmente para FormArray
   */
  formGroup(): FormGroup
}

export class ConfigFormGroupFactory implements FormGroupFactory{
  /**
   * Implementacion general de FormGroupFactory
   */
  config: FormArrayConfig | FormGroupConfig

  public constructor(config: FormArrayConfig | FormGroupConfig){
    this.config = config;
  }

  formGroup(): FormGroup {
    /**
     * deberia ser final! no deberia sobrescribirse
     */
    var fg = new FormGroup({})

    this.formGroupAssign(fg)

    return fg;
  }

  formGroupAssign(fg: FormGroup){
    /**
     * deberia ser final! no deberia sobrescribirse
     */
    for(var key in this.config.controls) {
      if(this.config.controls.hasOwnProperty(key) && !fg.contains(key)) {
         var fc = new FormControl({value: this.config.controls[key].default, disabled: this.config.controls[key].disabled})
         //if(!this.config.controls[key].label) this.config.controls[key].label = key;
         /**
          * La asignacion por defecto del label se derivo directamente a cada 
          * componente. La decision se basa en que la definicion de 
          * FormControl puede realizarse de diferentes lugares y ademas se es-
          * ta asignando valor a un "config" en un metodo que define "form" 
          */
        if(this.config.controls[key].required) fc.setValidators(Validators.required)
        fg.addControl(key, fc)
      } 
    }
 
    //if(this.disabled) fg.disable()
  }

}

export interface SortControl {
  /**
   * @deprecated?
   */
  position: number;
}

export class FormControlsConfig extends FormConfig {
  /**
   * Clase de configuración que obligatoriamente debe poseer el atributo con-
   * trols.
   */
  controls: { [index: string]: FormConfig } = {}
  
  contains(key: string){ return this.controls.hasOwnProperty(key) }

  get(key: string ){ return this.controls[key]  }

  addControl(key: string, control: FormConfig){
    control.parent = this
    this.controls[key] = control
  }

  setControls(controls: { [index: string]: FormConfig }){
    this.controls = {};
    for(var key in controls) 
      if(controls.hasOwnProperty(key)) this.addControl(key, controls[key])
  }
  
  constructor(controls:{ [index: string]: FormConfig } = {}) {
    super()
    this.setControls(controls)
  }
}

export class FormGroupConfig extends FormControlsConfig {
  /**
   * Configuracion de un FormGroup
   */

   override controls: { [index: string]: FormControlConfig }  = {}

   public defaultValues(): {[key:string]:any} {
    var dv:{[key:string]:any} = {}

    Object.keys(this.controls).forEach(key => {
      dv[key] = this.controls[key].default;
    });

    return dv;
  }

  initAdmin(){
    /**
     * Inicializar FormGroup para administracion
     * 
     * Se verifica la existencia de campos necesarios para administracion
     */
    if(!this.contains("id")) this.addControl("id", new FormControlConfig())
  }

  initControl(control: FormGroup){
    /**
     * Agregar al control, los campos faltantes de config
     */
    var c = new ConfigFormGroupFactory(this)
    c.formGroupAssign(control);
  }

  constructor(controls:{ [index: string]: FormConfig } = {}) {
    super()
    this.setControls(controls)
  }

}


export class AbstractControlOption {
  /**
   * @deprecated?
   */
  config?: FormConfig
  control?: AbstractControl

  constructor(attributes: any) {
    Object.assign(this, attributes)
  }
}

export class FormArrayConfig extends FormControlsConfig {
  override controls: { [index: string]: FormControlConfig }  = {}
  factory?: FormGroupFactory 
  /**
   * es necesario definir una clase concreta de FormGroupFactory que permita
   *  definir el FormGroup del FormArray
   */

  order?: {[key: string]: string}
  /**
   * ordenamiento por defecto para realizar la consulta
   * 
   * @example {motivo:"asc", per-nombres:"desc"}
   */

  initAdmin(){
    if(!this.factory) this.factory = new ConfigFormGroupFactory(this)
    if(!this.contains("_mode")) this.addControl("_mode", new FormControlConfig())
    if(!this.contains("id")) this.addControl("id", new FormControlConfig())
  }

  initFactory(){
    /**
     * Inicializacion de factory
     */
    if(!this.factory) this.factory = new ConfigFormGroupFactory(this)
  }

  
  constructor(controls:{ [index: string]: FormConfig } = {}) {
    super()
    this.setControls(controls)
  }
 
}

export class FormControlConfig extends FormConfig {
  default:any = null
  disabled:boolean = false //valor opcional, puede definirse directamente en el AbstractControl
  required:boolean = false;
  
  /**
   * Atributos de presentacion, se definen a continuacion los principales
   * Se deja abierta la posibilidad de definir atributos de presentacion adicionales
   */
  component: any
  label?:string
  validatorMsgs: ValidatorMsg[] = []
  position: number = 0;
  [key: string]: any
  /**
   * @example
   * wrap?: FieldWrapOptions | FieldWrapOptions[] //envolturas, se definen en el orden de definicion
   * showLabel: boolean = true //indica si debe mostrarse el label o no
   * readonly: boolean = false
   * placeholder: string = null
   * width:FieldWidthOptions = new FieldWidthOptions() 
   */

  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
  
}
