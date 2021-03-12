import { FieldControlOptions, FieldDateOptions, FieldDefaultOptions, FieldInputAutocompleteOptions, FieldInputCheckboxOptions, FieldInputDateOptions, FieldInputSelectCheckboxOptions, FieldInputSelectOptions, FieldInputSelectParamOptions, FieldInputTextOptions, FieldInputTimeOptions, FieldInputYearOptions, TypeLabelOptions, FieldSummaryOptions, FieldTextareaOptions, FieldYesNoOptions } from "./field-type-options";
import { InputPersistOptions, RouterLinkOptions } from "./field-view-aux-options"
import { FieldWidthOptions } from "./field-width-options";

export class FieldViewOptions {
    /**
     * Opciones de FieldView.
     * Todas las caracteristicas de los fields 
     * que pueden influir en un aspecto visual
     * se incluyen en esta clase.
     */
    field: string //nombre campo, 
    /**
     * si se utiliza en una tabla o estructura similar 
     * identifica el dato dentro del objeto, por lo tanto debe ser unico
     * si se necesitan usar variaciones para el mismo identificador, 
     * es necesario definir alias adicionales para el mismo valor,
     * por ejemplo data["nombre"] <=> data["nombre_aux"]
     */ 
    label?: string = null //etiqueta campo
    labelDisabled?: boolean = false; //deshabilitar label
    //entityName?: string = null //nombre de la entidad principal (@deprecated)

    aux?: RouterLinkOptions | InputPersistOptions = null; //opciones para field-view-aux
  
    default?:any = null; //valor por defecto (podria considerarse como parte de FieldControlOptions)
    
    type?: FieldInputCheckboxOptions
      | FieldDefaultOptions
      | FieldTextareaOptions 
      | FieldInputYearOptions 
      | FieldInputTimeOptions 
      | FieldInputDateOptions 
      | FieldInputSelectParamOptions 
      | FieldInputSelectOptions 
      | FieldInputSelectCheckboxOptions 
      | FieldInputAutocompleteOptions 
      | FieldInputDateOptions 
      | FieldInputTextOptions 
      | FieldDateOptions 
      | FieldYesNoOptions 
      | FieldSummaryOptions 
      | TypeLabelOptions = new FieldDefaultOptions()
  
    control?: FieldControlOptions = new FieldControlOptions();
    sortDisabled?:boolean //deshabilitar ordenamiento
   
    width?:FieldWidthOptions = new FieldWidthOptions(); //ancho del contenedor
  
    constructor(attributes: any) {
      for(var a in attributes){
        if(attributes.hasOwnProperty(a)){
          this[a] = attributes[a]
        }
      }
    }
  }
  