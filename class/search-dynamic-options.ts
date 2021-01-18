export class SearchDynamicOptions {
  searchAll: boolean = true; //activar/desactivar busqueda general
  searchParams: boolean = false; //activar/desactivar busqueda parametros
  searchCondition: boolean = false; //activar/desactivar busqueda condiciones
  searchOrder: boolean = false; //activar/desactivar ordenamiento
  
  constructor(attributes: { [index: string]: any } = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
