import { FieldTreeElement } from "./field-tree-element";

export class FieldConfig {
  field: string //nombre
  label: string //etiqueta
  type?: string = "default" //tipo
  /**
   * date, si_no, summary, label, field_label, tree
   */
  entityName?: string //nombre entidad de referencia
  format?: string //formato
  routerLink?: string //enlace
  queryParamField?: string //valor enlace
  sortDisabled?:boolean //deshabilitar ordenamiento
  tree?:FieldTreeElement
  /**
   * Ejemplo:
   * tree:
        new FieldTreeElement({entityName:"comision", fieldNames:["division"],
          tree: [
            new FieldTreeElement({entityName:"planificacion", fkName:"planificacion", fieldNames:["anio","semestre"], join:"" }),
            new FieldTreeElement({entityName:"sede", fkName:"sede", fieldNames:["numero"], prefix:"-"}),
          ]
        }),
   */

  widthXs?:string = "100%" //screen and (max-width: 599px)
  widthSm?:string = "50%" //screen and (min-width: 600px) and (max-width: 959px)
  widthMd?:string //screen and (min-width: 960px) and (max-width: 1279px)
  widthLg?:string //screen and (min-width: 1280px) and (max-width: 1919px)
  widthXl?:string //screen and (min-width: 1920px) and (max-width: 5000px)
  widthLtSm?:string //screen and (max-width: 599px)
  widthLtMd?:string //screen and (max-width: 959px)
  widthLtLg?:string //screen and (max-width: 1279px)
  widthLtXl?:string //screen and (max-width: 1919px)
  widthGtXs?:string //screen and (min-width: 600px)
  widthGtSm?:string = "25%" //screen and (min-width: 960px)
  widthGtMd?:string //screen and (min-width: 1280px)
  widthGtLg?:string //screen and (min-width: 1920px)

  /**
   * ejemplo: {name:"fecha",type:"date", format:"mediumDate",routerLink:"comision-detail",queryParamField:"comision"}
   */ 
  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
