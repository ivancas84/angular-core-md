import { Input, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FieldViewOptions } from '@component/field-view/field-view.component';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'core-input-value',
  templateUrl: './input-value.component.html',
})
export class InputValueComponent implements OnInit {
  /**
   * Define un form control a partir de un valor y otros parametros
   * Realiza una persistencia directa
   * Por defecto utiliza la api persist_unique
   * @todo Nombre sugerido, input-persist
   */
  /**
   * @example
   * <core-input-value [fieldViewOptions]="viatico" [entityName]="'viatico'" [value]="row.viatico"
   * [params]="{organo:display.getParam('organo'), periodo:display.getParam('periodo'), departamento_judicial:row.id}"></core-input-value>
   *   viatico: FieldViewOptions = new FieldViewOptions({
   *     field:"valor", width:"100px", 
   *     validators: [Validators.pattern('^-?[0-9]+(\\.[0-9]{1,2})?$'),
   *     Validators.max(99999999999999999.99),
   *     Validators.min(-99999999999999999.99)]
   *   });
   */  
  @Input() entityName: string
  /**
   * Puede no ser el mismo valor que fieldViewOptions.entityName
   * @todo En que casos puede no ser el mismo valor?
   * por eso se define de forma independiente 
   **/
  @Input() value: any
  @Input() fieldViewOptions: FieldViewOptions
  @Input() params?: { [index: string]: any } = {}
  @Input() persistApi: string = "persist_unique"

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
          if(this.value == "") return of(true);
          if(this.field.invalid) {
            this.snackBar.open("Valor incorrecto " + this.value, "X");
            return of(true)
          }
          this.params[this.fieldViewOptions.field] = value;
          return this.dd._post(this.persistApi, this.entityName, this.params).pipe(
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
