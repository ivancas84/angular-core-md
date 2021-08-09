import { ComponentOptions } from "./component-options";
import { FormControlOption } from "./reactive-form-config";
import { ValidatorMsg } from "./validator-msg";

export class FieldsetDynamicOptions extends ComponentOptions{
  /**
   * Opciones de FieldsetDynamicComponent
   * Definir una clase de opciones facilita la asignacion de valores.
   * Es util para aquellas estructuras donde se manipulan diferentes tipos de componentes y cada una tiene su juego de opciones y valores por defecto definidos.
   */

  id: string = "fieldset"
  validatorMsgs: ValidatorMsg[] = [] //mensajes de validacion del fieldset
  intro?:string //parrafo con un mensaje de introduccion al formulario, util para indicar instrucciones breves
  optTitle: FormControlOption[] = []; //opciones de titulo
  title?: string;
  entityName?: string;

  constructor(attributes: any = {}) {
    super()
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
