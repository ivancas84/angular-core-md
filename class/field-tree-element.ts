export class FieldTreeElement {
  entityName: string = null
  fkName: string = null //fk utilizada para la relacion
  fieldNames: string[] = null
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
}
