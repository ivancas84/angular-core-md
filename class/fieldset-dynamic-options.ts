import { ValidatorMsg } from "./validator-msg";

export class FieldsetDynamicOptions {
  /**
   * Opciones de FieldsetDynamicComponent
   * Definir una clase de opciones facilita la asignacion de valores.
   * Es util para aquellas estructuras donde se manipulan diferentes tipos de componentes y cada una tiene su juego de opciones y valores por defecto definidos.
   */

  inputSearchGo: boolean = true //activar o desactivar el formulario de busqueda rapida
  validatorMsgs: ValidatorMsg[] = [] //opciones de validacion del fieldset
  intro?:string //parrafo con un mensaje de introduccion al formulario, util para indicar instrucciones breves

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
