import { FieldViewOptions } from "./field-view-options";

export class TableDynamicOptions {
  /**
   * Opciones de TableDynamicComponent
   * Definir una clase de opciones facilita la asignacion de valores por defecto en distintos componentes.
   * Es util para aquellas estructuras donde se manipulan diferentes tipos de componentes y cada una tiene su juego de opciones y valores por defecto definidos.
   * Solo deben definirse atributos de configuracion que no varian, para aquellos elementos que si varian (ejemplo datos, atributos de busqueda o display, etc, se recomienda manterlos como parametros independientes)
   */

  serverSortTranslate: { [index: string]: string[] } = {}; //traduccion de campos de ordenamiento
   /**
    * @example {"nombre":["per-apellidos","per-nombres"], "departamento_judicial":["per_dj-codigo"]}
    */
  serverSortObligatory: string[]; //ordenamiento obligatorio en el servidor
    /**
     * Ciertos campos que son utilizados en subcomponentes y traducidos a otros valores puede ser necesario ordenarlos siempre en el servidor
     * Si se ordenan en el cliente, no se proporcionara un ordenamiento correcto
     * Es utilizado por ejemplo para las claves foraneas que se muestran a traves del componente "label". El valor original es un id, si se ordena por el id puede no proporcional el valor deseado
     * Si un campo se incluye en serverSortObligatory, casi con seguridad estara tambien incluido su valor en serverSortTranslate
     */
 
  entityName?: string;
  fieldsViewOptions: FieldViewOptions[]
  title: string //titulo del componente
  sortDirection: string = "asc";
  sortDisabled: string[]= []; //campos a los que se deshabilita el ordenamiento
  optColumn: any[] = null; //columna opciones (si es null no se visualiza)

  // addButtonLink: string = null;
  // addButtonQueryParams: { [index: string]: any } = {};
  // copyButton: boolean = true;
  // printButton: boolean = true;

  sortActive: string = null;
  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
