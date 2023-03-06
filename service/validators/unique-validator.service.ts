import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, FormControl, ValidationErrors } from "@angular/forms";
import { Display } from "@class/display";
import { DataDefinitionService } from "@service/data-definition/data-definition.service";
import { SessionStorageService } from "@service/storage/session-storage.service";
import { map, mergeMap, Observable, of, timer } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UniqueValidator implements AsyncValidator {
  /**
   * Debe reimplementarse para asignar valor por defecto a los atributos
   * O debe crearse una clase en vez de un servicio
   */
  field_name!: string;
  entity_name!: string;
  idName!: string; //nombre del identificador utilizado para el 

  constructor(
    protected dd: DataDefinitionService, 
  ) {}

  validate(control: FormControl): Observable<ValidationErrors | null> {
    var display: Display = new Display;
    if(!control.value) return of(null);
    display.setCondition([this.field_name, "=", control.value]);

    return timer(1000).pipe(
      mergeMap(()=> {
        return this.dd.id(this.entity_name, display).pipe(
          map(
            id => {
              return (id && (id != control.parent!.get(this.idName)!.value)) ? { notUnique: id } : null
            }
          )
        );
      })
    )
  }


}