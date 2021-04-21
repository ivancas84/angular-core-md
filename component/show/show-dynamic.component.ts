import { Component } from '@angular/core';
import { ShowComponent } from './show.component';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-show-dynamic',
  template: '',
})
export abstract class ShowDynamicComponent extends ShowComponent { //2
  fieldsViewOptions: FieldViewOptions[] = []
  fieldsViewOptionsSp: FieldViewOptions[] = []
  optColumn: any[] = null; //columna opciones (si es null no se visualiza)
  /**
   * Cada elemento debe ser uno de los siguientes OptRouteIcon | OptLinkIcon | OptRouteText | OptLinkText
   */

   switchAction($event:any){ throw new Error("Not Implemented"); }
  /**
   * Sobescribir si se necesita utilizar eventos
   * Utilizar $event.action para la accion a ejecutar (corresponde a opt.action)
   * Utilizar $event.data para los datos a utilizar (corresponde a row)
   */
}
