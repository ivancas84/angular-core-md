
export interface FieldView {
  field: string; //nombre del field  
  label: string; //etiqueta del field
  type?: string; //tipo
  entityName?: string; //nombre de la entidad de referencia
  format?: string; //formato
  routerLink?: string; //enlace
  queryParamField?: string; //valor utilizado para el enlace
  sortDisabled?:boolean; //deshabilitar ordenamiento
  /**
   * ejemplo: {name:"fecha",type:"date", format:"mediumDate",routerLink:"comision-detail",queryParamField:"comision"}
   */ 
}
