import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";

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
