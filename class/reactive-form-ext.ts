import { KeyValue } from "@angular/common";
import { AbstractControl, FormArray } from "@angular/forms";
import { FieldsetDynamicOptions } from "./fieldset-dynamic-options";
import { FormControl, FormGroup } from "@angular/forms";
import { DownloadOptions, UmOptions, FieldInputCheckboxOptions, FieldDefaultOptions, FieldTextareaOptions, FieldInputYearOptions, FieldInputTimeOptions, FieldInputDateOptions, FieldInputSelectParamOptions, FieldInputSelectOptions, FieldInputSelectCheckboxOptions, FieldInputAutocompleteOptions, FieldInputTextOptions, FieldDateOptions, FieldYesNoOptions, FieldSummaryOptions, TypeLabelOptions } from "./field-type-options";
import { RouterLinkOptions, InputPersistOptions } from "./field-view-aux-options";
import { FieldWidthOptions } from "./field-width-options";
import { ValidatorMsg } from "./validator-msg";
import { Pipe, PipeTransform } from "@angular/core";
import { TableDynamicOptions } from "./table-dynamic-options";
import { ComponentOptions } from "./component-options";
import { fastClone } from "@function/fast-clone";

@Pipe({
  name: 'controlCast',
  pure: true
})
export class ControlCast implements PipeTransform {  
  transform(value: any, args?: any): FormControlExt {
    return value;
  }
}

@Pipe({
  name: 'noHidden',
  pure: true
})
export class NoHidden implements PipeTransform {  
  transform(value: FormGroupExt, args?: any): FormGroupExt {
    var f = new FormGroupExt({})
    Object.keys(value.controls).forEach(key => {
      if((value.controls[key] as FormControlExt).type.id != "hidden") f.addControl(key, value.controls[key]);
    });
    return f;
  }
}

export interface SortControl {
  position: number;
}

export interface ReactiveFormId {
  id: string;
}


export interface SortMember {
  sort(a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number
}


export class FormGroupExt extends FormGroup implements SortControl, SortMember, ReactiveFormId{
  /**
   * Extension de FormGroup pra definir formularios dinamicos
   */

  id: string = "form_group"

  position: number = 0;

  options?: ComponentOptions; //opciones especificas del componente
  /**
   * Para facilitiar la iteracion entre estructuras y asignar las opciones de componente directamente a traves de la estructura se define el atributo options
   * Actualmente existe solo FieldsetDynamicOptions, pero posteriormente se habiliten nuevos tipos de opcion (Ej FieldsetArrayDynamicOptions)
   * Cuando existen distintos tipos de opciones, es convienente definir una clase independiente para facilitar la definicion de valores por defecto,
   * segun el juego de opciones los valores por defecto variaran
   */
  
  validatorMsgs: ValidatorMsg[] = []


  public set(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
 
  defaultValues(): any  {
    var dv = {}
    Object.keys(this.controls).forEach(key => {
      if((this.controls[key] as FormControlExt).id =="form_control"){
        dv[key] = (this.controls[key] as FormControlExt).default;
      } else if((this.controls[key] as FormGroupExt).id =="form_group"){
        dv[key] = (this.controls[key] as FormGroupExt).defaultValues();
      }  else if((this.controls[key] as FormGroupExt).id =="form_array"){
        dv[key] = (this.controls[key] as FormArrayExt).default;
      }
    })
    return dv;
  } 
  
 

  public getName(): string | null {
    let group = <FormGroup>this.parent;

    if (!group) {
      return null;
    }

    let name: string;

    Object.keys(group.controls).forEach(key => {
      let childControl = group.get(key);

      if (childControl !== this) {
        return;
      }

      name = key;
    });

    return name;
  }
  
  sort = (a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0);
  }

  initValue(value: {
    [key: string]: any;
  }, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {

    Object.keys(value).forEach(key => { 
      if(key.includes("/")){ //la forma facil de identificar si es un FormArray es con la key (si tiene caracter / es un FormArray) 
        /**
         * Si existen valores para el array, se limpia y crean instancias utilizando factory.formGroup
         */
        var f = (this.controls[key] as FormArrayExt);
        f.clear();
        for(var i = 0; i <value[key].length; i++) f.push(f.factory.formGroup());
      }
    });
    this.patchValue(value, options)
  }

  /**
   * Se realiza una traduccion del atributo params que contienen {{key}}
   */
  public matchParams(params: any){
    var p = fastClone(params)
    for(var i in p){
      if(p.hasOwnProperty(i)){
        var key = p[i].match(/\{\{(.*?)\}\}/)
        if(key) {
          if(!this.controls[key[1]].value) return null;
          p[i] = this.controls[key[1]].value;
        }
      }
    }
    return p;
  }
}


export class FormControlExt extends FormControl implements ReactiveFormId{
  /**
   * @example Using FormGroup
   * const formGroup = new FormGroup({
   *   firstName: new FormControlExt('',[])
   * });
   * (formGroup.get('firstName') as StandardFormControl).label = 'customValue';
   * 
   * var f = new FormControlExt();
   * f.label = "test"
   */
  label?: string = null //etiqueta campo

  id: string = "form_control"

  position: number = 0;

   /**
     * Opciones de FieldView.
     * Todas las caracteristicas de los fields 
     * que pueden influir en un aspecto visual
     * se incluyen en esta clase.
     */
    field: string //nombre campo, 
    /**
     * Si se utiliza en una tabla o estructura similar 
     * identifica el dato dentro del objeto, por lo tanto debe ser unico.
     * 
     * Si se necesitan usar variaciones para el mismo identificador, 
     * es necesario definir alias adicionales para el mismo valor,
     * por ejemplo data["nombre"] <=> data["nombre_aux"]
     * 
     * En una estructura tabular identifica tambien el ordenamiento
     * Prestar especial atencion al valor que se indica ya que puede 
     * aplicarse ordenamiento en el cliente o en el servidor
     */ 

    aux?: RouterLinkOptions | InputPersistOptions = null; //opciones para field-view-aux
  
    type?: DownloadOptions
      | UmOptions  
      | FieldInputCheckboxOptions
      | FieldDefaultOptions
      | FieldTextareaOptions 
      | FieldInputYearOptions 
      | FieldInputTimeOptions 
      | FieldInputDateOptions 
      | FieldInputSelectParamOptions 
      | FieldInputSelectOptions 
      | FieldInputSelectCheckboxOptions 
      | FieldInputAutocompleteOptions 
      | FieldInputDateOptions 
      | FieldInputTextOptions 
      | FieldDateOptions 
      | FieldYesNoOptions 
      | FieldSummaryOptions 
      | TypeLabelOptions = new FieldDefaultOptions()
  
    showLabel: boolean = false; //indica si debe mostrarse el label o no
      /**
       * no siempre se puede indicar label = null para esconder el label
       */
    
    default?: any = null //valor por defecto
    readonly?: boolean = false
    validatorMsgs: ValidatorMsg[] = []
    placeholder: string = null
    
    /**
     * @todo los siguientes elementos forman parte de un nuevo atributo options, objeto con llaves no definidas que variaran segun la interfaz
     * por ejemplo para TableComponent cada elemento tendra los atributos sortDisabled, para FieldsetOptions tendra el atributo width
     * no confundir con las opciones del componente, esto vendria a ser como opciones de elementos segun el componente (FieldTableOptions)
     */
    sortDisabled?:boolean //deshabilitar ordenamiento
   
    width?:FieldWidthOptions = new FieldWidthOptions(); //ancho del contenedor
 
    set(attributes: any) {
      for(var a in attributes){
        if(attributes.hasOwnProperty(a)){
          this[a] = attributes[a]
        }
      }
    }

    public getName(): string | null {
      let group = <FormGroup>this.parent;
  
      if (!group) {
        return null;
      }
  
      let name: string;
  
      Object.keys(group.controls).forEach(key => {
        let childControl = group.get(key);
  
        if (childControl !== this) {
          return;
        }
  
        name = key;
      });
  
      return name;
    }


    
}


export interface FormGroupFactory{
  formGroup(): FormGroupExt;
}

export class FormArrayExt extends FormArray implements SortControl, SortMember, ReactiveFormId{
  /**
   * @example Using FormGroup
   * const formArray = new FormArrayExt({
   *   firstName: new FormControlExt('',[])
   * });
   * (formGroup.get('firstName') as StandardFormControl).label = 'customValue';
   * 
   * var f = new FormControlExt();
   * f.label = "test"
   */
  id: string = "form_array"

  position: number = 0;

  factory: FormGroupFactory //es necesario definir una clase concreta de FormGroupFactory con el FormGroupExt del FormArray
  
  order?: {[key: string]: string}; //ordenamiento por defecto para realizar la consulta
  /**
   * @example {motivo:"asc", per-nombres:"desc"}
   */

  default: any[] = [] //valores por defecto para el FormArray
  /**
   * Los valores por defecto del formGroup se definen en el factory
   */

  validatorMsgs: ValidatorMsg[] = []


  options?: TableDynamicOptions;

  set(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
    

  sort = (a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number => {
    console.log(a.value)
    console.log(b.value)
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0);
  }

  initValue(
    value: any[], 
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    this.clear();
    //si existen valores por defecto para el array, debe inicializarse el formgroup
    for(var i = 0; i <value.length; i++) this.push(this.factory.formGroup());
    this.patchValue(value, options)
  }
}