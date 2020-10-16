import { Input, OnInit, Component, DoCheck, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { first, map, startWith, mergeMap, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Display } from '../../class/display';
import { getControlName } from '@function/get-control-name';
import { DataDefinitionLabelService } from '@service/data-definition-label/data-definition-label.service';


@Component({
  selector: 'core-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styles:[`
  .inline {
    display: inline-flex;
    align-items: center;
  }
  `],
})
export class InputAutocompleteComponent implements  OnInit, DoCheck, OnDestroy {
  /**
   * Input autocomplete reutilizable
   * Define un input independiente para facilitar la incorporacion de funcionalidad adicional (validación de seteo, clear, etc)
   * 
   * @todo
   * Existe un atributo displayFn que podria utilizarse para visualizar el label en el template
   * pero no funciona correctamente con Observables
   * Actualmente se utilizan dos inputs en el template uno para visualizar el label una vez seleccionado
   * y otro para visualizar el input y autocomplete si no se encuentra seleccionado
   * En versiones posteriores, una vez que displayFn permita Observables, se puede reimplementar esta funcionalidad
   */

  @Input() field: FormControl;
  @Input() entityName: string;
  @Input() title?: string;
  @Input() adminRoute?: string; //Ruta opcional de administracion para la clave foranea (si no se define no se activa el enlace)
  @Input() uniqueRoute?: string; //Ruta opcional de administracion para valor unico (si no se define no se activa el enlace)
  
  public label: string = null;
  /**
   * Atributo para visualizar el label
   * En versiones posteriores puede reemplazarse por displayFn cuando acepte Observables
   */

  load$: Observable<any>;
  searchControl: FormControl = new FormControl();

  protected subscriptions = new Subscription();

  filteredOptions: Observable<Array<{[key:string]: any}>>;

  constructor(
    public dd: DataDefinitionService, 
    public ddl: DataDefinitionLabelService,
  ) { }

  ngDoCheck(): void {
    if(this.field.errors && !this.searchControl.errors) this.searchControl.setErrors(this.field.getError);
    if(this.field.dirty && !this.searchControl.dirty) this.searchControl.markAsDirty();
  }
  
  get uniqueParams() {
    /**
     * Definir parametros de administracion si se ingresa un valor unico
     */
    let queryParams = {};    
    queryParams[getControlName(this.field)] = this.field.value;
    return queryParams;
  }

  ngOnInit(): void {
    if(!this.title) this.title = this.entityName;

    this.searchControl.setValidators(this.field.validator)

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(""),
      tap(value => {
        if(value && (typeof value != "string" ) && (value.id != this.field.value)) {
          this.field.setValue(value.id)  
        }
      }),
      debounceTime(300),

      distinctUntilChanged(),
      mergeMap(value => {
        if (typeof value == "string" ) return this._filter(value)
        else {
          this.searchControl.disable();
          return of([])
        }
      })
    )

    this.load$ = this.field.valueChanges.pipe(
      startWith(this.field.value),
      tap(
        value => {
          if(!this.searchControl.value
          || (typeof this.searchControl.value != "string" 
              && this.searchControl.value.id != value)){
            this.initValue(value);
          }
        }
      ),
      switchMap(
        value => {
          return this.ddl.label(this.entityName, value)
        }
      ),
      map(
        label => {
          this.label = label;
          return true;
        }
      )
    );
  }
  
  initValue(value){
    var s =this.dd.get(this.entityName, value).pipe(first()).subscribe(
      row => {
        if(row) { 
          this.searchControl.setValue(row);
          this.searchControl.disable();
        } else {
          this.searchControl.setValue("");
          this.searchControl.enable();
        }
      }
    );
    this.subscriptions.add(s);
  }

  private _filter(value: string): Observable<any> {
    if(value === "") return of([]);
    var display = new Display();
    display.addCondition(["_label","=~",value]);
    return this.dd.all(this.entityName, display);
  }
  
  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
