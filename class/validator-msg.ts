
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
  /**
   * @member route: ruteo en caso de que exista valor unico.
   *
   * Si no esta definido route, no se define enlace para valor unico y se ig-
   * noran los atributos queryParams y uniqueParam. 
   */

  uniqueParam:any = "id" 
  queryParams = {}
  /**
   * @member queryParams: uniqueParam se asigna a queryParams con el valor del error
   * adicionalmente se pueden definir queryParams alternativos.
   * Si no se necesitan queryParams alternativos, no hace falta definir este valor
   * se asignara directamente {uniqueParam:uniqueValue}
   */
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
  id:string = "pattern"
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

