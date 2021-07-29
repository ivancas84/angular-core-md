import { FormGroupExt } from "./reactive-form-ext";

export abstract class Opt {
  id: string;
  action: string;
  title?: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  data?: FormGroupExt; //referencia al conjunto de datos donde se obtendra params
}

export class OptRouteIcon extends Opt { //2
  id: string = "route_icon"
  template: string = "info";
  target: string = "_self";
  /**
   * si los datos se almacenan de la forma data["ej"] = ["id":"value","key":"value",...] 
   * entonces key = "ej"
   */ 
  
  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class OptLinkIcon extends Opt {
  id: string = "link_icon"
  color: string = null;
  template: string = "info";
  target: string = "_self";


  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class OptRouteText extends Opt {
  id: string = "route_text"
  template: string = "info";

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class OptLinkText extends Opt {
  id: string = "link_text"
  template: string = "info";

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class OptEventIcon extends Opt {
  id: string = "event_icon"
  template: string = "info";
  ariaLabel: string = null;
  color: string = null;

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


