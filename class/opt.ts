
export class OptRouteIcon { //1
  id: string = "route_icon"
  routeLink: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  icon: string = "info";

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class OptLinkIcon { //1
  id: string = "link_icon"
  link: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  icon: string = "info";

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class OptRouteText { //1
  id: string = "route_text"
  routeLink: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  text: string = "info";

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class OptLinkText { //1
  id: string = "link_text"
  link: string;
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  icon: string = "info";

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


