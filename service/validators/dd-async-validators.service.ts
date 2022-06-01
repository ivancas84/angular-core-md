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
export class DdAsyncValidatorsService {
  /**
   * Validadores asincrónicos que utilizan el servicio dd
   */

  constructor(protected dd: DataDefinitionService) {}

  unique(fieldName: string, entityName: string, idName: string = "id"): AsyncValidatorFn {
    /**
     * Verificar campo unico
     * Se puede evitar el fieldName a traves de un metodo de busqueda
     * No se implementa de esta forma para reducir el procesamiento
     */
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      var display: Display = new Display;
      if(!control.value) return of(null);
      display.setCondition([fieldName, "=", control.value]);

      return timer(1000).pipe(
        mergeMap(()=> {
        return this.dd.id(entityName, display).pipe(
          map(
            id => {
              return (id && (id != control.parent!.get(idName)!.value)) ? { notUnique: id } : null
            }
          )
        );
      }))
    };
  }

  furtherError(entityName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
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

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      let values: Array<any> = [];

      return timer(1000).pipe(
        mergeMap(()=> {
          for(let f in fields) { 
            if(!control.get(fields[f])!.value) return of(null)
            values.push(control.get(fields[f])!.value);          
          }
          
          let filters = [];
          for(let i = 0; i < fields.length; i++) filters.push([fields[i], "=", values[i]]);
         
          let display: Display = new Display;
          display.setCondition(filters);

          return this.dd.id(entity, display).pipe(
            map(
              id => {
                return (id && (id != control.get("id")!.value)) ? { notUnique: id } : null;
              },
            )
          );
        
        }
      ))  
    }
  }

}
