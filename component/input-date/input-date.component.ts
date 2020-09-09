import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'app/core/const/DATE_FORMATS';
import { getControlName } from '@function/get-control-name';

@Component({
  selector: 'core-input-date',
  templateUrl: './input-date.component.html',
  styles:[`
    mat-datepicker-toggle {
      display: inline-block;
  }
  `],
  providers: [{
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
  ]
})
export class InputDateComponent implements OnInit {
  @Input() field: FormControl;
  @Input() title?: string;
  @Input() placeholder?: string = "Seleccione fecha";
 
  adminRoute:string;
  /**
   * Interfaz de administracion para cuando se carga un valor unico
   * @todo puede ser un Input y dar la posibilidad de indicar la interfaz de administración
   */

  fieldName:string;
  /**
   * Nombre del campo, utilizado como filtro para cargar la interfaz de administracion
   */

  ngOnInit(): void {
    this.fieldName = getControlName(this.field);
    this.adminRoute = getControlName(this.field.parent);
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
