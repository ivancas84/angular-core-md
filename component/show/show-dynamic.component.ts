import { Component, OnInit } from '@angular/core';
import { ShowComponent } from './show.component';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-show-dynamic',
  template: '',
})
export abstract class ShowDynamicComponent extends ShowComponent implements OnInit { //4
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

  switchAction($event:any){ 
    /**
     * Acciones de opciones
     * Sobescribir si se necesita utilizar eventos
     * Utilizar $event.action para la accion a ejecutar (corresponde a opt.action)
     * Utilizar $event.data para los datos a utilizar (corresponde a row)
     */  
    switch($event.action){
      case "delete":
        this.delete($event.data["id"])
        /**
         * No utilizar indice (si se utiliza ordenamiento angular no se refleja el cambio de indices, y se elimina la fila incorrecta)
         * @todo conviene implementar el eliminar directamente en la tabla?
         */
      break;
      default:
        throw new Error("Not Implemented");
    }   
  }
   
}
