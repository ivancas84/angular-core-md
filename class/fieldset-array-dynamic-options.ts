export class FieldsetArrayDynamicOptions{
  /**
   * Opciones de FieldsetDynamicComponent
   * Definir una clase de opciones facilita la asignacion de valores.
   * Es util para aquellas estructuras donde se manipulan diferentes tipos de componentes y cada una tiene su juego de opciones y valores por defecto definidos.
   */

  id: string = "fieldset-array"

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
