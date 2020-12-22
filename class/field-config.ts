
export class FieldConfig {
  field: string; //nombre del field  
  label: string; //etiqueta del field
  type?: string = "default"; //tipo
  entityName?: string; //nombre de la entidad de referencia
  format?: string; //formato
  routerLink?: string; //enlace
  queryParamField?: string; //valor utilizado para el enlace
  sortDisabled?:boolean; //deshabilitar ordenamiento
  widthXs?:string = "25%";
  widthMd?:string = "50%";
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
