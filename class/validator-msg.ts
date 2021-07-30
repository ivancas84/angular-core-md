
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
  queryParams = {} //uniqueParam se asigna a queryParams con el valor del error, adicionalmente se pueden definir queryParams alternativos
  message:string = "El valor ya se encuentra en uso" //mensaje a visualizar


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

export class PatternValidatorMsg extends ValidatorMsg {
  id:string = "pattern"
  message:string = "El formato es incorrecto"
}

export class MinValidatorMsg extends ValidatorMsg {
  id:string = "min"
  message:string = "Inferior al mínimo permitido"
}


export class MaxValidatorMsg extends ValidatorMsg {
  id:string = "max"
  message:string = "Superior al máximo permitido"
}

export class EmailValidatorMsg extends ValidatorMsg {
  id:string = "email"
  message:string = "El formato es incorrecto"
} 

export class MinLengthValidatorMsg extends ValidatorMsg {
  id:string = "minlength"
  message:string = "Longitud incorrecta"
} 

export class MaxLengthValidatorMsg extends ValidatorMsg {
  id:string = "maxlength"
  message:string = "Longitud incorrecta"
} 

