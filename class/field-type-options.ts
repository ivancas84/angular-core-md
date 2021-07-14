import { FieldTreeElement } from "./field-tree-element";
import { AsyncValidatorOpt, ValidatorOpt } from "./validator-opt";

   

export class FieldControlOptions { //1.1
  /**
   * Podemos identificar atributos asociados directamente con un FormControl de angular y otros asociados indirectamente.
   * Los atributos asociados directamente coinciden con el nombre de algun atributo de FormControl, ej validator, asyncValidators
   * Ejemplo de atributos asociados indirectamente son default, readonly.
   * Para definir un atributo como FieldControlOptions uno debe hacerse la pregunta: Puede existir este atributo para un elemento que no sea FormControl? 
   * Reformulando la pregunta: Tiene sentido este atributo para elementos que no son FormControl?
   * Hay elementos que pueden parecer de FormControl pero en realidad corresponden a un determinado type,  
   * La postura tomada hasta el momento es estricta, por ejemplo los atributos adminRoute y uniqueRoute para ciertos type no tienen sentido, por lo tanto se definen solo para los type en los que tiene sentido.
   * Siguiendo con el ejemplo, readonly tiene sentido para todos los type que son FormControl, por lo tanto se define en FormControlOptions
   */
  id: string = null
  showLabel: boolean = false; //indica si debe mostrarse el label o no
  /**
   * no siempre se puede indicar label = null para esconder el label
   */

  default?: any = null //valor por defecto
  disabled?: boolean = false
  readonly?: boolean = false
  validatorOpts: ValidatorOpt[] = []
  asyncValidatorOpts: AsyncValidatorOpt[] = []

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldDefaultOptions { //1
  id: string = "default"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldHiddenOptions { //1
  id: string = "hidden"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldInputCheckboxOptions { //1
  id: string = "input_checkbox"
  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldTextareaOptions { //1
  id: string = "textarea"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}




export class FieldInputTimeOptions  { //1
  id: string = "input_time"

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldInputDateOptions  { //1
  id: string = "input_date"
  
  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputYearOptions { //1
  id: string = "input_year"
  
  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldTreeOptions { //1
  id: string = "tree"
  tree: FieldTreeElement = null

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputSelectParamOptions { //1
  id: string = "input_select_param"
  options: any[] = [];

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputSelectOptions { //1
  id: string = "input_select";
  entityName: string = null;

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputSelectCheckboxOptions { //1
  id: string = "input_select_checkbox";
  options: any[] = null;

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputAutocompleteOptions { //1
  id: string = "input_autocomplete";
  entityName: string = null;
  adminRoute: string = null;

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputUploadOptions { //1
  id: string = "input_upload";
  entityName: string = "file";

  constructor(attributes: any= {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class UmOptions {
  id: string = "um"
  fields: any
  
  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldInputTextOptions { //1.1
  id: string = "input_text" 
  width: string = null //ancho exclusivo del input
  /**
   * Se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
   */
  uniqueRoute: string = null;
  uniqueParam: string = "id";

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}



export class FieldDateOptions { //1
  id: string = "date"
  format: string = "dd/MM/yyyy"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldYesNoOptions { //1
  id: string = "yes_no"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldSummaryOptions { //1
  id: string = "summary"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class DownloadOptions { //1
  id: string = "download"
  entityName: string = "file"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class TypeLabelOptions { //1
  id: string = "label"
  entityName: string

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldLabelOptions { //1
  id: string = "field_label"
  entityName: string
  fieldNames: string[]
  join: string = " ";

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}