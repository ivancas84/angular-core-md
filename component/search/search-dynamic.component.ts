import { Input, Component, OnInit } from '@angular/core';
import { FieldViewOptions } from '@class/field-view-options';
import { SearchComponent } from '@component/search/search.component';

@Component({
  selector: 'core-search-dynamic',
  templateUrl: './search-dynamic.component.html',
})
export class SearchDynamicComponent extends SearchComponent { //2
  
  @Input() searchParams: boolean = true; //activar/desactivar busqueda parametros
  @Input() searchCondition: boolean = false; //activar/desactivar busqueda condiciones
  @Input() searchOrder: boolean = false; //activar/desactivar ordenamiento
  @Input() title: string = "Opciones"
  @Input() fieldsViewOptionsSp?: FieldViewOptions[] = []; //fields control search params
  @Input() fieldsViewOptionsSc?: FieldViewOptions[] = []; //fields control search condition
  
}
