import { FieldControlOptions, FieldDateOptions, FieldDefaultOptions, FieldInputAutocompleteOptions, FieldInputCheckboxOptions, FieldInputDateOptions, FieldInputSelectCheckboxOptions, FieldInputSelectOptions, FieldInputSelectParamOptions, FieldInputTextOptions, FieldInputTimeOptions, FieldInputYearOptions, TypeLabelOptions, FieldSummaryOptions, FieldTextareaOptions, FieldYesNoOptions, UmOptions, DownloadOptions } from "./field-type-options";
import { InputPersistOptions, RouterLinkOptions } from "./field-view-aux-options"
import { FieldWidthOptions } from "./field-width-options";

export class FieldViewOptions { //2
    /**
     * Opciones de FieldView.
     * Todas las caracteristicas de los fields 
     * que pueden influir en un aspecto visual
     * se incluyen en esta clase.
     */
    field: string //nombre campo, 
    /**
     * Si se utiliza en una tabla o estructura similar 
     * identifica el dato dentro del objeto, por lo tanto debe ser unico.
     * 
     * Si se necesitan usar variaciones para el mismo identificador, 
     * es necesario definir alias adicionales para el mismo valor,
     * por ejemplo data["nombre"] <=> data["nombre_aux"]
     * 
     * En una estructura tabular identifica tambien el ordenamiento
     * Prestar especial atencion al valor que se indica ya que puede 
     * aplicarse ordenamiento en el cliente o en el servidor
     */ 
    label?: string = null //etiqueta campo

    aux?: RouterLinkOptions | InputPersistOptions = null; //opciones para field-view-aux
  
    type?: DownloadOptions
      | UmOptions  
      | FieldInputCheckboxOptions
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

    /**
     * @todo los siguientes elementos forman parte de un nuevo atributo options, objeto con llaves no definidas que variaran segun la interfaz
     * por ejemplo para TableComponent cada elemento tendra los atributos sortDisabled, para FieldsetOptions tendra el atributo width
     * no confundir con las opciones del componente, esto vendria a ser como opciones de elementos segun el componente (FieldTableOptions)
     */
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
  