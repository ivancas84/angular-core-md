import { FieldTreeElement } from "./field-tree-element";

   

export class FieldControlOptions { //1.0.1
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

export class FieldDefaultOptions {
  id: string = "default"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldHiddenOptions {
  id: string = "hidden"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldInputCheckboxOptions {
  id: string = "input_checkbox"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldTextareaOptions {
  id: string = "textarea"

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}




export class FieldInputTimeOptions  {
  id: string = "input_time"

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldInputDateOptions  {
  id: string = "input_date"
  
  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputYearOptions  {
  id: string = "input_year"
  
  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldTreeOptions {
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

export class FieldInputSelectParamOptions {
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

export class FieldInputSelectOptions  {
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

export class FieldInputSelectCheckboxOptions  {
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

export class FieldInputAutocompleteOptions  {
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



export class FieldInputTextOptions  {
  id: string = "input_text" 
  width: string = null //ancho exclusivo del input
  uniqueRoute: string = null;
  uniqueParam: string = null; //si es null se asignara posteriormente con el nombre del field

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}



export class FieldDateOptions {
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


export class FieldYesNoOptions {
  id: string = "yes_no"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldSummaryOptions {
  id: string = "summary"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class TypeLabelOptions {
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

export class FieldLabelOptions {
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