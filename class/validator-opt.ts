import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";

export class ValidatorOpt {
  id:string
  fn:ValidatorFn | AsyncValidatorFn
  message:string

  constructor(attributes: any = {}) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}


export class UniqueValidatorOpt extends ValidatorOpt {
  fn:AsyncValidatorFn
  route:string
  queryParams:any  
}
