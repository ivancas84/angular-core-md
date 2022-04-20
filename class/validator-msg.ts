
export class ValidatorMsg {
  id!:string  //id del validador (debe ser el mismo que el identificador del error retornado)
  message!:string //mensaje a visualizar

  constructor(attributes: any = {}) {
    Object.assign(this, attributes)
  }
}

export class UniqueValidatorMsg extends ValidatorMsg {
  override id:string="notUnique"
  
  route:string | undefined
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
  override message:string = "El valor ya se encuentra en uso" //mensaje a visualizar

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class RequiredValidatorMsg extends ValidatorMsg {
  override id:string = "required" //id del validador (debe ser el mismo que el identificador del error retornado)
  override message:string = "Debe completar valor" //mensaje a visualizar

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class DateValidatorMsg extends ValidatorMsg {
  override id:string = "matDatepickerParse"
  override message:string = "El formato es incorrecto"
  
  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class PatternValidatorMsg extends ValidatorMsg {
  override id:string = "pattern"
  override message:string = "El formato es incorrecto"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class MinValidatorMsg extends ValidatorMsg {
  override id:string = "min"
  override message:string = "Inferior al mínimo permitido"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}


export class MaxValidatorMsg extends ValidatorMsg {
  override id:string = "max"
  override message:string = "Superior al máximo permitido"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

export class EmailValidatorMsg extends ValidatorMsg {
  override id:string = "pattern"
  override message:string = "El formato es incorrecto"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
} 

export class MinLengthValidatorMsg extends ValidatorMsg {
  override id:string = "minlength"
  override message:string = "Longitud incorrecta"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
} 

export class MaxLengthValidatorMsg extends ValidatorMsg {
  override id:string = "maxlength"
  override message:string = "Longitud incorrecta"

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
} 

