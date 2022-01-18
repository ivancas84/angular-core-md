
export class ValidatorMsg {
  id:string //id del validador (debe ser el mismo que el identificador del error retornado)
  message:string //mensaje a visualizar

  constructor(attributes: any = {}) {
    Object.assign(this, attributes)
  }
}

export class UniqueValidatorMsg extends ValidatorMsg {
  id:string="notUnique"
  route:string
  uniqueParam:any = "id" 
  queryParams = {} //uniqueParam se asigna a queryParams con el valor del error, adicionalmente se pueden definir queryParams alternativos
  message:string = "El valor ya se encuentra en uso" //mensaje a visualizar

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class RequiredValidatorMsg extends ValidatorMsg {
  id:string = "required" //id del validador (debe ser el mismo que el identificador del error retornado)
  message:string = "Debe completar valor" //mensaje a visualizar

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class DateValidatorMsg extends ValidatorMsg {
  id:string = "matDatepickerParse"
  message:string = "El formato es incorrecto"
  
  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class PatternValidatorMsg extends ValidatorMsg {
  id:string = "pattern"
  message:string = "El formato es incorrecto"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class MinValidatorMsg extends ValidatorMsg {
  id:string = "min"
  message:string = "Inferior al mínimo permitido"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}


export class MaxValidatorMsg extends ValidatorMsg {
  id:string = "max"
  message:string = "Superior al máximo permitido"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class EmailValidatorMsg extends ValidatorMsg {
  id:string = "email"
  message:string = "El formato es incorrecto"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
} 

export class MinLengthValidatorMsg extends ValidatorMsg {
  id:string = "minlength"
  message:string = "Longitud incorrecta"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
} 

export class MaxLengthValidatorMsg extends ValidatorMsg {
  id:string = "maxlength"
  message:string = "Longitud incorrecta"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
} 

