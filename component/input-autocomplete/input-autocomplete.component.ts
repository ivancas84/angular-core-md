import { Input, OnInit, Component, DoCheck, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { map, startWith, mergeMap, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Display } from '../../class/display';
import { getControlName } from '@function/get-control-name';
import { DataDefinitionLabelService } from '@service/data-definition-label/data-definition-label.service';
import { ValidatorMsg } from '@class/validator-msg';
import { FormControlConfig } from '@class/reactive-form-config';
import { titleCase } from '@function/title-case';

export class InputAutocompleteConfig extends FormControlConfig {
  component: any = InputAutocompleteComponent
  entityName?: string;
  /**
   * @member entityName: Nombre de la entidad para consultar datos.
   * Por defecto se define con el nombre del controlador
   */
  label?: string;
  /**
   * @member label: Etiqueta de presentación.
   * Por defecto se define con el nombre del controlador en un formato Xx Yy
   */
  validatorMsgs: ValidatorMsg[] = [];

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }

}

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
export class InputAutocompleteComponent implements  OnInit, DoCheck, OnDestroy { //1.1
  /**
   * Input autocomplete reutilizable.
   * 
   * Define un input independiente para facilitar la incorporacion de funcio-
   * nalidad adicional (validación de seteo, clear, etc).
   * 
   * Para las consultas realiza un dd.all utilizando el campo "label" (label 
   * debe estar correctamente definido en el servidor)
   * 
   * Para visualizar el resultado utiliza el ddl.label (label del cliente, se 
   * recomienda que coincida con el del servidor)
   * 
   * Para inicializar utiliza dd.get
   * 
   * @todo
   * Existe un atributo displayFn que podria utilizarse para visualizar el label en el template
   * pero no funciona correctamente con Observables
   * Actualmente se utilizan dos inputs en el template uno para visualizar el label una vez seleccionado
   * y otro para visualizar el input y autocomplete si no se encuentra seleccionado
   * En versiones posteriores, una vez que displayFn permita Observables, se puede reimplementar esta funcionalidad
   */

  @Input() config: InputAutocompleteConfig
  @Input() control: FormControl;

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
    if(this.control.errors && !this.searchControl.errors) this.searchControl.setErrors(this.control.getError);
    if(this.control.dirty && !this.searchControl.dirty) this.searchControl.markAsDirty();
  }
  
  get uniqueParams() {
    /**
     * Definir parametros de administracion si se ingresa un valor unico
     */
    let queryParams = {};    
    queryParams[getControlName(this.control)] = this.control.value;
    return queryParams;
  }


  ngOnInit(): void {
    if(!this.config.label) {
      var n = getControlName(this.control)
      this.config.label = titleCase(n.substring(n.indexOf("-")+1).replace("_"," "))
    }
    
    if(!this.config.entityName) {
      if(!n) var n = getControlName(this.control)
      this.config.entityName = n.substring(n.indexOf("-")+1)
    }

    this.searchControl.setValidators(this.control.validator)

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(""),
      tap(value => {
        if(value && (typeof value != "string" ) && (value.id != this.control.value)) {
          this.control.setValue(value.id)  
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

    this.load$ = this.control.valueChanges.pipe(
      startWith(this.control.value),
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
          return this.ddl.label(this.config.entityName, value)
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
    var s =this.dd.get(this.config.entityName, value).subscribe(
      row => {
        if(row) { 
          this.searchControl.setValue(row);
          this.searchControl.disable();
        } else {
          this.searchControl.setValue("");
          if(!this.control.disabled) this.searchControl.enable();
        }
      }
    );
    this.subscriptions.add(s);
  }

  private _filter(value: string): Observable<any> {
    if(value === "") return of([]);
    var display = new Display();
    display.addCondition(["_label","=~",value]);
    return this.dd.all(this.config.entityName, display);
  }
  
  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
