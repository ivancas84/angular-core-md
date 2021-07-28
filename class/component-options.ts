export abstract class ComponentOptions {
  id: string //identificador del componente
  /**
   * No es un identificador unico, permite identificar el tipo de componente, todos los componentes del mismo tipo tendran el mismo identificador
   */
  entityName?: string //entidad principal del componente

  title?: string //titulo del componente

}
