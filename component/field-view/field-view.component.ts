import { Component, Input} from '@angular/core';
import { FieldTreeElement } from '@class/field-tree-element';

export class FieldViewOptions {
  /**
   * Opciones de FieldView
   */
  field: string //nombre
  label?: string = null //etiqueta

  type?: string = "default" //tipo
  /**
   * date, si_no, summary, label, field_label, tree
   * input_date, input_text, input_checkbox 
   */

  entityName?: string //nombre entidad de referencia
  format?: string //formato
  routerLink?: string //enlace
  queryParamField?: string //valor enlace
  sortDisabled?:boolean //deshabilitar ordenamiento
  
  tree?:FieldTreeElement //utilizar cuando type = tree
  /**
   * Ejemplo: Prestar atencion al elemento fkName, hace referencia a la hoja padre
   * tree:
        new FieldTreeElement({entityName:"comision", fieldNames:["division"],
          tree: [
            new FieldTreeElement({entityName:"planificacion", fkName:"planificacion", fieldNames:["anio","semestre"], join:"" }),
            new FieldTreeElement({entityName:"sede", fkName:"sede", fieldNames:["numero"], prefix:"-"}),
          ]
        }),
   */

  options?: any = null;
  validators?: any[];
  asyncValidators?: any[];
  default?: any = null; //valor por defecto
  adminRoute?: string = null;
  uniqueRoute?: string = null;
  disabled?: boolean = false;


  width?:string; //ancho del contenedor

  /**
   * ancho de flex
   */
  widthXs?:string = "100%" //screen and (mx-width: 599px)
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

@Component({
  selector: 'core-field-view',
  templateUrl: './field-view.component.html',
})
export class FieldViewComponent {
  /**
   * Define como debe visualizarse un campo
   */
  @Input() fieldViewOptions: FieldViewOptions; //opciones
  @Input() data: { [index: string]: any }; //conjunto de campos
  /**
   * Por que se recibe un conjunto de campos?
   * La visualizacion de un campo puede requerir enlaces u otros elementos que quieren los valores de los campos asociados
   */
}
