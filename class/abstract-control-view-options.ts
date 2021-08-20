import { KeyValue } from "@angular/common";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { Display } from "./display";
import { AbstractControlOption, SortControl, FormArrayConfig, FormGroupConfig } from "./reactive-form-config";
import { ValidatorMsg } from "./validator-msg";

export interface AbstractControlViewOptionsArray{
  length?:number
  loadLength:boolean
  display?:Display
}

export class AbstractControlViewOptions {
  /**
   * A diferencia de los FieldViewOptions, los AbstractControlViewOptions, no se definen en las clases de configuracion porque son mas complejos y generan relaciones recursivas.
   * Los AbstractControlViewOptions utilizan FieldViewOptions
   * Los FieldViewOptions no deberian utilizan AbstractControlViewOptions para no generar relaciones recursivas, pero pueden definirse en el templat
   */
  pos: number = 0
  id: string =  "default"
}

//DEFAULT GROUP
export class DefaultAbstractControlViewOptions extends AbstractControlViewOptions {
  id: string = "default"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class HiddenViewOptions extends AbstractControlViewOptions { //1
  id: string = "hidden"

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}



export class StructureViewOptions extends AbstractControlViewOptions { //1
  id: string = "default"
  sort = (a: KeyValue<string,SortControl>, b: KeyValue<string,SortControl>): number => {
    return a.value.position > b.value.position ? 1 : (b.value.position > a.value.position ? -1 : 0)
  }

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}



export class TableViewOptions extends AbstractControlViewOptions implements AbstractControlViewOptionsArray{
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
  optColumn: AbstractControlOption[] = []; //columna opciones 

  optField: FormControl = new FormControl() //optField del componente anidado
  optFooter: AbstractControlOption[] = [] //opciones de footer
  optTitle: AbstractControlOption[] = [ //opciones de titulo
    new AbstractControlOption({
      viewOptions: new EventIconViewOptions({
        icon: "content_copy", 
        action: "copy_content", 
        color: "primary",
        title:"Copiar",
        fieldEvent: this.optField
      }),
      config: new FormArrayConfig({})
    }),
    new AbstractControlOption({
      viewOptions: new EventIconViewOptions({
        icon: "print", 
        action: "print_content",
        color: "primary",
        title:"Copiar",
        fieldEvent: this.optField
      }),
      config: new FormArrayConfig({})
    }),
  ]

  titleLoad: boolean = true
  sortActive: string = null;
  showPaginator:boolean = true; //flag para visualizar el paginador
  pageSizeOptions=[10, 25, 50, 100] //habilitar el page size
  length?:number
  loadLength:boolean = true
  display?:Display  
  fieldset: FormArray //datos principales
  config: FormArrayConfig //configuracion principal
  footer: FormGroup //inicizar luego de asigar config.factory -> this.footer = this.config.factory.formGroup()
  /**
   * se puede utilizar config.factory para inicializar -> this.footer = this.config.factory.formGroup()
   * ojo con los valores por defecto, se recomienda this.footer.reset()
   */
  footerConfig: FormGroupConfig 

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}



export class FieldsetViewOptions extends AbstractControlViewOptions{
  /**
   * Opciones de FieldsetDynamicComponent
   * Definir una clase de opciones facilita la asignacion de valores.
   * Es util para aquellas estructuras donde se manipulan diferentes tipos de componentes y cada una tiene su juego de opciones y valores por defecto definidos.
   */

  id: string = "fieldset"
  validatorMsgs: ValidatorMsg[] = [] //mensajes de validacion del fieldset
  intro?:string //parrafo con un mensaje de introduccion al formulario, util para indicar instrucciones breves
  optTitle: AbstractControlOption[] = []; //opciones de titulo
  title?: string;
  entityName?: string;
  fieldset: FormGroup //datos principales
  config: FormGroupConfig //configuracion principal

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class EventIconViewOptions extends AbstractControlViewOptions {

  id: string = "event_icon"
  icon: string;
  color:string="primary"
  action: string;
  title?: string;
  fieldEvent: FormControl;

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class RouteIconFieldViewOptions extends AbstractControlViewOptions {

  id: string = "route_icon"
  icon: string = "info";
  target: string = "_self";
	key: string = "id"
  color:string="primary"
  routerLink: string;
  title?: string;

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class LinkTextFieldViewOptions extends AbstractControlViewOptions {
  id: string = "link_text"
  download: boolean = false
  prefix: string = ""
  target: string
  title?: string

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class EventButtonViewOptions extends AbstractControlViewOptions {

  id: string = "event_button"
  text: string;
  color:string="primary"
  action: string;
  title?: string;
  fieldEvent: FormControl;

  constructor(attributes: any) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}



