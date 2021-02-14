import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FieldViewOptions } from '@class/field-view-options';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'core-input-persist',
  templateUrl: './input-persist.component.html',
})
export class InputPersistComponent implements OnInit {
  /**
   * Define un form control a partir de un valor y otros parametros
   * Realiza una persistencia directa
   * Por defecto utiliza la api persist_unique
   * Cumple una funcion similar a field-view-aux,
   * pero no se puede generalizar tanto ya que el @input params es muy variable
   */
  /**
   * @example
   * <core-input-persist [fieldViewOptions]="viatico" [entityName]="'viatico'" [value]="row.viatico"
   * [params]="{organo:display.getParam('organo'), periodo:display.getParam('periodo'), departamento_judicial:row.id}"></core-input-persist>
   *   viatico: FieldViewOptions = new FieldViewOptions({
   *     field:"valor", width:"100px", 
   *     validators: [Validators.pattern('^-?[0-9]+(\\.[0-9]{1,2})?$'),
   *     Validators.max(99999999999999999.99),
   *     Validators.min(-99999999999999999.99)]
   *   });
   */  
  @Input() value: any
  @Input() fieldViewOptions: FieldViewOptions
  @Input() params?: { [index: string]: any } = {} //parametros para identificar univocamente el campo que se debe persistir
  @Input() api: string = "persist_unique" //api de persistencia

  field: FormControl;
  load$: Observable<any>;
  
  constructor(
    protected dd: DataDefinitionService, 
    protected snackBar: MatSnackBar,
    protected storage: SessionStorageService,
  ) {}
  
  ngOnInit(): void {
    this.field = new FormControl(
      {
        value:this.value,
        disabled:this.fieldViewOptions.disabled
      }, 
      {
        validators:this.fieldViewOptions.validators,
        asyncValidators:this.fieldViewOptions.asyncValidators,
      }
    );

    this.load$ = this.field.valueChanges.pipe(
      startWith(this.value),
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap (
        value => { 
          if(value == this.value) return of(true)
          this.value = value;
          if(this.value === "") return of(true);
          if(this.field.invalid) {
            this.snackBar.open("Valor incorrecto " + this.value, "X");
            return of(true)
          }
          this.params[this.fieldViewOptions.field] = value;
          return this.dd._post(this.api, this.fieldViewOptions.entityName, this.params).pipe(
            tap(
              response => {
                this.snackBar.open("Se ha registrado " + this.value, "X");
                this.removeStorage(response);
              }
            )
          )
        }
      ),
      catchError(
        (error) => {
          this.snackBar.open(JSON.stringify(error), "X");
          return error 
        }
      )
    );
  }

  removeStorage(response){
    this.storage.removeItemsContains(".");
    this.storage.removeItemsPersisted(response["detail"]);
  }

}
