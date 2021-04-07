import { FieldTreeElement } from "./field-tree-element";

   

export class FieldControlOptions { //v1
  id: string = null
  showLabel: boolean = false; //indica si debe mostrarse el label o no
  /**
   * no siempre se puede indicar label = null para esconder el label
   */

  validators: any[] = [];
  asyncValidators: any[] = [];
  default?: any = null; //valor por defecto
  adminRoute?: string = null;
  uniqueRoute?: string = null;
  disabled?: boolean = false;
  
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