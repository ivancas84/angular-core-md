export class FieldTreeElement {
  entityName: string = null
  fkName: string = null
  fieldNames: string[] = null
  join: string = " "
  prefix: string = ""
  suffix: string = ""

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
