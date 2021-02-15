import { FieldControlOptions, FieldDateOptions, FieldDefaultOptions, FieldInputAutocompleteOptions, FieldInputCheckboxOptions, FieldInputDateOptions, FieldInputSelectCheckboxOptions, FieldInputSelectOptions, FieldInputSelectParamOptions, FieldInputTextOptions, FieldInputTimeOptions, FieldInputYearOptions, FieldLabelOptions, FieldSummaryOptions, FieldTextareaOptions, FieldYesNoOptions } from "./field-type-options";
import { InputPersistOptions, RouterLinkOptions } from "./field-view-aux-options"
import { FieldWidthOptions } from "./field-width-options";

export class FieldViewOptions {
    /**
     * Opciones de FieldView.
     * Todas las caracteristicas de los fields 
     * que pueden influir en un aspecto visual
     * se incluyen en esta clase.
     */
    field: string //nombre campo
    label?: string = null //etiqueta campo
    entityName?: string = null //nombre de la entidad principal

    aux?: RouterLinkOptions | InputPersistOptions = null; //opciones para field-view-aux
  
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
      | FieldLabelOptions = new FieldDefaultOptions()
  
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
  