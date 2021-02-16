export class RouterLinkOptions {
  id: string = "router_link"
  path: string = null
  params: {}; //utilizar [[key]] para identificar valor del conjunto de datos

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class InputPersistOptions {
  id: string = "input_persist"
  params: {} //utilizar [[key]] para identificar valor del conjunto de datos
  api: string = "persist_unique"

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
