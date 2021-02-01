export class FieldTreeElement {
  entityName: string = null //entidad principal
  fkName: string = null //fk utilizada para la relacion
  fieldNames: string[] = []
  join: string = " "
  prefix: string = ""
  suffix: string = ""
  tree: FieldTreeElement[] = []

  constructor(attributes: any = []) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }

  /**
   * Ejemplo planificacion u:u_ plan
   * planificacionTree = new FieldTreeElement({
   * entityName:"planificacion",
   * fkName:"plan",
   * tree:[
   *   new FieldTreeElement({
   *     entityName:"plan",
   *     fieldNames:["orientacion","distribucion_horaria"],
   *     join:" - "
   *   })
   * ]
  })
   */

}
