import { Input, OnInit, Component, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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

  value: Date;
  /**
   * Valor local para evitar error ExpressionChangedAfterItHasBeenCheckedError
   */

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
        if(!value) this.field.setValue(value)
        else if((value instanceof Date) && 
        (
          !(this.value instanceof Date)
          || ((this.value instanceof Date) && (value.getTime() != this.value.getTime()))
        )          
        ) {
          this.field.setValue(value);
          this.value = value;
        }
      }
    );
    
    this.load$ = this.field.valueChanges.pipe(
      startWith(this.field.value),
      map(
        value => {
          /** 
           * Se implementa logica y atributo this.value adicional para evitar error expressionchangedafterithasbeencheckederror
           * Toda esta logica es necesario porque la libreria utilizada no soporte strings como valores iniciales
           */
          if(value && !(value instanceof Date)) { value = new Date(value); }
          this.value = value;
          if(((!this.value || !this.searchControl.value) && (this.value != this.searchControl.value))
          || ((this.value instanceof Date) && (this.searchControl.value instanceof Date) && (this.value.getTime() != this.searchControl.value.getTime()))){
            this.searchControl.setValue(this.value);
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
