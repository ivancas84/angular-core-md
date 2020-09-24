import { Input, OnInit, Component, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';
import { Observable, of } from 'rxjs';
import { startWith, tap, debounceTime, distinctUntilChanged, mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'core-input-timepicker',
  templateUrl: './input-timepicker.component.html',
})
export class InputTimepickerComponent implements OnInit, DoCheck {
  /**
   * Se define un input independiente para incorporar la funcionalidad de inicializar a traves de string
   * La libreria solo permite valores date, se realiza un proceso de formateo interno
   */
  @Input() field: FormControl;
  @Input() title?: string;
  @Input() placeholder?: string = "Seleccione hora";
 
  searchControl: FormControl = new FormControl();

  adminRoute:string;
  /**
   * Interfaz de administracion para cuando se carga un valor unico
   * @todo puede ser un Input y dar la posibilidad de indicar la interfaz de administración
   */

  fieldName:string;
  /**
   * Nombre del campo, utilizado como filtro para cargar la interfaz de administracion
   */

  load$: Observable<any>;

  ngDoCheck(): void {
    if(this.field.errors && !this.searchControl.errors) this.searchControl.setErrors(this.field.getError);
    if(this.field.dirty && !this.searchControl.dirty) this.searchControl.markAsDirty();
  }

  ngOnInit(): void {
    this.fieldName = getControlName(this.field);
    this.adminRoute = getControlName(this.field.parent);

    this.searchControl.setValidators(this.field.validator)

    this.searchControl.valueChanges.subscribe(
        value => {
          console.log(value);
          if((!value || value instanceof Date) && value != this.field.value){
            console.log("estoy");
            this.field.setValue(value);
          }
        }
    );
    
    this.load$ = this.field.valueChanges.pipe(
      startWith(this.field.value),
      map(
        value => {
          if(value && !(value instanceof Date)) {
            value = new Date(value);
            this.field.setValue(value);
          }
          if(value != this.searchControl.value){
            this.searchControl.setValue(value)
          }
          return true;
        }
      ),
    );
  }
 
  get adminParams() {
    /**
     * Definir parametros de administracion si se ingresa un valor unico
     */
    let queryParams = {};
    queryParams[this.fieldName] = this.field.value;
    return queryParams;
  }
  
}
