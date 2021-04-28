import { Component, OnInit } from '@angular/core';
import { ShowComponent } from './show.component';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-show-dynamic',
  template: '',
})
export abstract class ShowDynamicComponent extends ShowComponent implements OnInit { //3
  fieldsViewOptions: FieldViewOptions[] = []
  fieldsViewOptionsSp: FieldViewOptions[] = []
  optColumn: any[] = null; //columna opciones (si es null no se visualiza)
  /**
   * Cada elemento debe ser uno de los siguientes OptRouteIcon | OptLinkIcon | OptRouteText | OptLinkText
   */

  title: string = null //titulo de la tabla

  ngOnInit(): void {
    if(this.title === null) this.title = this.entityName;
    super.ngOnInit();
  }

  switchAction($event:any){ throw new Error("Not Implemented"); }
  /**
   * Sobescribir si se necesita utilizar eventos
   * Utilizar $event.action para la accion a ejecutar (corresponde a opt.action)
   * Utilizar $event.data para los datos a utilizar (corresponde a row)
   */ 
}
