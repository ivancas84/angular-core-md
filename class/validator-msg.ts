
export class ValidatorMsg {
  id:string //id del validador (debe ser el mismo que el identificador del error retornado)
  message:string //mensaje a visualizar

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class UniqueValidatorMsg extends ValidatorMsg {
  id:string="notUnique"
  route:string
  uniqueParam:any = "id" 
  queryParams = {}

  constructor(attributes: any = {}) {
    super(attributes);
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

export class RequiredValidatorMsg extends ValidatorMsg {
  id:string = "required" //id del validador (debe ser el mismo que el identificador del error retornado)
  message:string = "Debe completar valor" //mensaje a visualizar
}

export class DateValidatorMsg extends ValidatorMsg {
  id:string = "matDatepickerParse"
  message:string = "El formato es incorrecto"
}

