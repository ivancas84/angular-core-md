export class RouterLinkOptions { //1.1
  id: string = "router_link"
  path: string = null
  params: {} = {id:"{{id}}"}; //utilizar {{key}} para identificar valor del conjunto de datos

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
  params: {} = {id:"{{id}}"}//utilizar {{key}} para identificar valor del conjunto de datos
  api: string = "persist_unique"
  entityName: string; //entidad correspondiente a la cual se realizara la persistencia
  fieldName: string; //field correspondiente a entityName al cual se realizara la persistencia
  /**
   * No siempre coincide con el field original por eso debe definirse en las opciones del persist
   */


  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
