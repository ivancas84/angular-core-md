import { Injectable } from '@angular/core';
import { SessionStorageService } from '../storage/session-storage.service';
import { FormControl, ValidatorFn, AsyncValidatorFn, ValidationErrors, AbstractControl, Validators } from '@angular/forms';
import { timer, of, Observable } from 'rxjs';
import { Display } from '../../class/display';
import { DataDefinitionService } from '../data-definition/data-definition.service';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  /**
   * Inicialmente se iban a crear funciones independientes para validación
   * Se opto por crear un servicio para poder importar otros servicios necesarios
   */

  constructor(protected dd: DataDefinitionService, protected storage: SessionStorageService) {}

  protected checkYear(year: any): ValidationErrors | null {
    /**
     * year puede ser un string en formato json de date o Moment
     */
    if (year) {
      //if(!/^[0-9]+$/.test(year)) return {nonNumeric:true} esta comparacion es erronea, tira eerror para valores de anios correctos
      //if(year.length != 4) return {notYear:true} esta comparacion es erronea, el anio puede ser transformado a un date y tener una longitud mayor a 4
      return null;
    }
    return null;
  }

  static notIncludes(searchValue: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (typeof control.value != "string") return null;
      return (control.value.includes(searchValue, 0)) ? {pattern:true} : null;
    }
  }

  static email(): ValidatorFn {
    return Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}");
  }

  static real(decimal:number = 2): ValidatorFn {
    return Validators.pattern('^-?[0-9]+(\\.[0-9]{1,'+decimal+'})?$');


  }

  year(): ValidatorFn {
    /**
     * Validar año (nonNumeric, notYear)
     */
    return (control: AbstractControl): ValidationErrors | null => {
      return this.checkYear(control.value);
    }
  }

  maxYear(year: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      var validateYear = this.checkYear(control.value);
      if(validateYear) return validateYear;

      if (control.value) {
        switch(year){
          case "CURRENT_YEAR":
            var currentYear = new Date().getFullYear();
            if(parseInt(control.value) > currentYear) return {maxYear:true};
          break;
          default:
              if(parseInt(control.value) > parseInt(year)) return {maxYear:true};
        }
      }
      return null;
    } 
  }

  minYear(year: string): ValidatorFn {
    /**
     * anio minimo
     * minYear:"anio minimo permitido"
     */
    return (control: AbstractControl): ValidationErrors | null => {
      var validateYear = this.checkYear(control.value);
      if(validateYear) return validateYear;

      if (control.value) {
        switch(year){
          case "CURRENT_YEAR":
            var currentYear = new Date().getFullYear();
            if(parseInt(control.value) < currentYear) return {minYear:currentYear};
          break;
          default:
              if(parseInt(control.value) < parseInt(year)) return {minYear:year};
        }
      }
      return null;
    } 
  }
}
