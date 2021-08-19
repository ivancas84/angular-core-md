import { FieldTreeElement } from "./field-tree-element";


export class FieldViewOptions {
  id: string =  "default"
}

export class FieldDefaultOptions extends FieldViewOptions { //1
  id: string = "default"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldHiddenOptions extends FieldViewOptions { //1
  id: string = "hidden"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}



export class FieldInputCheckboxOptions extends FieldViewOptions { //1
  id: string = "input_checkbox"
  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldTextareaOptions extends FieldViewOptions { //1
  id: string = "textarea"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}




export class FieldInputTimeOptions extends FieldViewOptions { //1
  id: string = "input_time"

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldInputDateOptions extends FieldViewOptions {
  id: string = "input_date"
  
  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputYearOptions extends FieldViewOptions {
  id: string = "input_year"
  
  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputYearMonthOptions extends FieldViewOptions {
  id: string = "input_year_month"
  
  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldTreeOptions extends FieldViewOptions {
  id: string = "tree"
  tree: FieldTreeElement = null

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputSelectParamOptions extends FieldViewOptions {
  id: string = "input_select_param"
  options: any[] = [];

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputSelectLabelOptions extends FieldViewOptions {
  id: string = "input_select_label"
  options: any[] = [];

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputSelectOptions extends FieldViewOptions {
  id: string = "input_select";
  entityName: string = null;

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputSelectCheckboxOptions extends FieldViewOptions { //1
  id: string = "input_select_checkbox";
  options: any[] = ["Sí", "No"];

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputAutocompleteOptions extends FieldViewOptions { //1
  id: string = "input_autocomplete";
  entityName: string = null;
  adminRoute: string = null;

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldInputUploadOptions extends FieldViewOptions {
  id: string = "input_upload";
  entityName: string = "file";

  constructor(attributes: any= {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class UmOptions extends FieldViewOptions {
  id: string = "um"
  fields: any
  
  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldInputTextOptions extends FieldViewOptions {
  id: string = "input_text" 
  width: string = null //ancho exclusivo del input
  /**
   * Se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
   */
  uniqueRoute: string = null;
  uniqueParam: string = "id";

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}



export class FieldDateOptions extends FieldViewOptions{
  id: string = "date"
  format: string = "dd/MM/yyyy"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldYesNoOptions extends FieldViewOptions{
  id: string = "yes_no"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class FieldSummaryOptions extends FieldViewOptions{ //1
  id: string = "summary"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class DownloadOptions extends FieldViewOptions{
  id: string = "download"
  entityName: string = "file"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class TypeLabelOptions extends FieldViewOptions{
  id: string = "label"
  entityName: string

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class FieldLabelOptions extends FieldViewOptions { //1
  id: string = "field_label"
  entityName: string
  fieldNames: string[]
  join: string = " ";

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

