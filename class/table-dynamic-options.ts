import { ComponentOptions } from "./component-options";
import { Opt, OptEventIcon } from "./opt";
import { FormControlOption, FormGroupConfig } from "./reactive-form-config";
import { FormControlExt } from "./reactive-form-ext";

export class TableDynamicOptions extends ComponentOptions{
  /**
   * Opciones de TableDynamicComponent
   * Definir una clase de opciones facilita la asignacion de valores por defecto en distintos componentes.
   * Es util para aquellas estructuras donde se manipulan diferentes tipos de componentes y cada una tiene su juego de opciones y valores por defecto definidos.
   * Solo deben definirse atributos de configuracion que no varian, para aquellos elementos que si varian (ejemplo datos, atributos de busqueda o display, etc, se recomienda manterlos como parametros independientes)
   */

  id: string = "table";

  serverSortTranslate: { [index: string]: string[] } = {}; //traduccion de campos de ordenamiento
   /**
    * @example {"nombre":["per-apellidos","per-nombres"], "departamento_judicial":["per_dj-codigo"]}
    */
  serverSortObligatory: string[] = []; //ordenamiento obligatorio en el servidor
    /**
     * Ciertos campos que son utilizados en subcomponentes y traducidos a otros valores puede ser necesario ordenarlos siempre en el servidor
     * Si se ordenan en el cliente, no se proporcionara un ordenamiento correcto
     * Es utilizado por ejemplo para las claves foraneas que se muestran a traves del componente "label". El valor original es un id, si se ordena por el id puede no proporcional el valor deseado
     * Si un campo se incluye en serverSortObligatory, casi con seguridad estara tambien incluido su valor en serverSortTranslate
     */
 
  sortDirection: string = "asc";
  sortDisabled: string[]= []; //campos a los que se deshabilita el ordenamiento
  optColumn: Opt[] = []; //columna opciones 
  optTitle: FormControlOption[] = [];

  //[ opciones de titulo 
  //   //new OptEventIcon({action:"copy_content", title:"Copiar", template:"content_copy", color:"primary"}),
  //   //new OptEventIcon({action:"print_content", title:"Imprimir", template:"print", color:"primary"}),
  // ]; 
  titleLoad: boolean = true
  sortActive: string = null;

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
