
export class FieldConfig {
  field: string; //nombre del field
  label: string; //etiqueta del field
  type: string = "string"; //tipo
  format?: string; //formato
  routerLink?: string; //enlace
  queryParamField?: string; //valor utilizado para el enlace
  /**
   * ejemplo: {name:"fecha",type:"date", format:"mediumDate",routerLink:"comision-detail",queryParamField:"comision"}
   */ 
}
