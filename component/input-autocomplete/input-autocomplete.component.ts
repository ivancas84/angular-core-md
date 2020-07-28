import { Input, OnInit, Component} from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { fastClone } from '../../function/fast-clone';
import { first, map, startWith, mergeMap, debounceTime, distinctUntilChanged, tap, catchError } from 'rxjs/operators';
import { Display } from '../../class/display';


@Component({
  selector: 'app-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
})
export class InputAutocompleteComponent implements  OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() field: FormControl;
  @Input() entityName: string;
  @Input() readonly?: boolean = false;
  @Input() load$: Observable<any>;

  searchControl: FormControl = new FormControl();
  searchFailed: boolean = false;
  disabled: boolean = true;

  protected subscriptions = new Subscription();

  filteredOptions: Observable<Array<{[key:string]: any}>>;

  constructor(
    protected dd: DataDefinitionService, 
    protected storage: SessionStorageService, 
  ) { }

  ngOnInit(): void {
    
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(""),
      tap(value => {
        if(value && (typeof value != "string" ) && (value.id != this.field.value)) {
          this.field.setValue(value.id)  
        }
      }),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.field.markAsPending()),
      mergeMap(value =>  (typeof value == "string" ) ? this._filter(value) : of([])),
      tap(() => this.field.markAsDirty())
    )

    this.load$ = this.field.valueChanges.pipe(
      startWith(this.field.value),
      map(
      value => {
          if(!this.searchControl.value
          || (typeof this.searchControl.value != "string" 
              && this.searchControl.value.id != value)){
            this.initValue(value);
          }
          return true;
        }
      )
    );
  }
  
  initValue(value){
    this.dd.getOrNull(this.entityName, value).pipe(first()).subscribe(
      row => {
        if(row) { 
          this.searchControl.setValue(row);
          //this.searchControl.disable();
        } else {
          this.searchControl.setValue("");
           //this.searchControl.enable();
        }
      }
    );
  }

  private _filter(value: string): Observable<any> {
    if(value === "") return of([]);

    var display = new Display();
    display.addCondition(["nombre","=~",value]);
    return this.dd.all(this.entityName, display);
  }

  displayFn(value: any): string {
    return value && value.id ? value.id : '';
  }
  

}
