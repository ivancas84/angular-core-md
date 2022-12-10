export class FieldWidthOptions {
  
  width?:string; //ancho del contenedor
  
  /**
   * ancho de flex
   */
  xs?:string = "100%" //screen and (mx-width: 599px)
  sm?:string = "50%" //screen and (min-width: 600px) and (max-width: 959px)
  md?:string //screen and (min-width: 960px) and (max-width: 1279px)
  lg?:string //screen and (min-width: 1280px) and (max-width: 1919px)
  xl?:string //screen and (min-width: 1920px) and (max-width: 5000px)
  ltSm?:string //screen and (max-width: 599px)
  ltMd?:string //screen and (max-width: 959px)
  ltLg?:string //screen and (max-width: 1279px)
  ltXl?:string //screen and (max-width: 1919px)
  gtXs?:string //screen and (min-width: 600px)
  gtSm?:string = "25%" //screen and (min-width: 960px)
  gtMd?:string //screen and (min-width: 1280px)
  gtLg?:string //screen and (min-width: 1920px)

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        (this as any)[a] = attributes[a]
      }
    }
  }
}