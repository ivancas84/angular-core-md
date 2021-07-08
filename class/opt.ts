

export class OptRouteIcon { //2
  id: string = "route_icon"
  action: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  template: string = "info";
  target: string = "_self";
 
  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class OptLinkIcon { //2
  id: string = "link_icon"
  action: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  template: string = "info";
  
  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class OptRouteText { //2
  id: string = "route_text"
  action: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  template: string = "info";

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class OptLinkText { //2
  id: string = "link_text"
  action: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  template: string = "info";

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class OptEventIcon { //2
  id: string = "event_icon"
  action: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  template: string = "info";
  ariaLabel: string = null;
  color: string = null;

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


