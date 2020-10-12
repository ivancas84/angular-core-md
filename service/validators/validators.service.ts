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

  protected checkYear(year: string): ValidationErrors | null {
    if (year) {
      if(!/^[0-9]+$/.test(year)) return {nonNumeric:true}
      if(year.length != 4) return {notYear:true}
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

  unique(fieldName: string, entityName: string): AsyncValidatorFn {
    /**
     * Verificar campo unico
     * Se puede evitar el fieldName a traves de un metodo de busqueda
     * No se implementa de esta forma para reducir el procesamiento
     */
    return (control: FormControl): Observable<ValidationErrors | null> => {
      var display: Display = new Display;
      if(!control.value) return of(null);
      display.setCondition([fieldName, "=", control.value]);

      return timer(1000).pipe(
        mergeMap(()=> {
        return this.dd.id(entityName, display).pipe(
          map(
            id => {
              return (id && (id != control.parent.get("id").value)) ? { notUnique: true } : null
            }
          )
        );
      }))
    };
  }

  furtherError(entityName: string): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors | null> => {
      return timer(1000).pipe(
        mergeMap(()=> {
          return this.dd.post("further_error", entityName, control.value);
        }
      ))  
    }
  }


  uniqueMultiple(entity: string, fields:Array<string>): AsyncValidatorFn {
    /**
     * Validar unicidad a traves de varios campos.
     * Ejemplo uniqueMultiple("comision",["division", "sede"]).
     * Se aplica al FormGroup que contiene los fields.
     */

    return (control: FormControl): Observable<ValidationErrors | null> => {
      let values: Array<any> = [];

      return timer(1000).pipe(
        mergeMap(()=> {
          for(let f in fields) values.push(control.get(fields[f]).value);          

          let filters = [];
          for(let i = 0; i < fields.length; i++) filters.push([fields[i], "=", values[i]]);
         
          let display: Display = new Display;
          display.setCondition(filters);

          return this.dd.id(entity, display).pipe(
            map(
              id => {
                return (id && (id != control.get("id").value)) ? { notUnique: id } : null;
              },
            )
          );
        
        }
      ))  
    }
  }

  uniqueMultipleForm(params: {[entity:string]: string}): AsyncValidatorFn {
    /**
     * Validar unicidad a traves de varios campos.
     * Ejemplo uniqueMultiple("comision",["division", "sede"]).
     * Se aplica al FormGroup que contiene los fields.
     */

    return (control: FormControl): Observable<ValidationErrors | null> => {
      let values: Array<any> = [];
      
      return null;
      /*
      return timer(1000).pipe(
        mergeMap(()=> {
          for(let f in fields) values.push(control.get(fields[f]).value);          

          let filters = [];
          for(let i = 0; i < fields.length; i++) filters.push([fields[i], "=", values[i]]);
         
          let display: Display = new Display;
          display.setCondition(filters);

          return this.dd.idOrNull(entity, display).pipe(
            map(
              id => {
                return (id && (id != control.get("id").value)) ? { notUnique: id } : null;
              },
            )
          );
        
        }
      ))*/  
    }
  }
}
