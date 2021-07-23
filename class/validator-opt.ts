import { AsyncValidatorFn, ValidatorFn, Validators } from "@angular/forms";

export class ValidatorOpt {
  id:string //id del validador (debe ser el mismo que el identificador del error retornado)
  fn:ValidatorFn //funcion de validacion
  message:string //mensaje a visualizar

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class AsyncValidatorOpt {
  id:string //id del validador (debe ser el mismo que el identificador del error retornado)
  fn:AsyncValidatorFn //funcion de validacion
  message:string //mensaje a visualizar

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class UniqueValidatorOpt extends AsyncValidatorOpt {
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

export class RequiredValidatorOpt extends ValidatorOpt {
  id:string = "required" //id del validador (debe ser el mismo que el identificador del error retornado)
  fn:ValidatorFn = Validators.required //funcion de validacion
  message:string = "Debe completar valor" //mensaje a visualizar
}

export class YearMonthValidatorOpt extends ValidatorOpt {
  id:string = "matDatepickerParse"
  fn:null //no se necesita definir funcion de validacion de Year month, ya se encuentra implicita
  message:string = "El formato es incorrecto"
}
