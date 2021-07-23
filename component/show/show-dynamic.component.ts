import { Component, OnInit } from '@angular/core';
import { ShowComponent } from './show.component';
import { FieldViewOptions } from '@class/field-view-options';
import { TableDynamicOptions } from '@class/table-dynamic-options';

@Component({
  selector: 'core-show-dynamic',
  template: '',
})
export abstract class ShowDynamicComponent extends ShowComponent {
  fieldsViewOptionsSp: FieldViewOptions[] = [] 
  /**
   * Cambiar posteriormente a searchOptions: SearchDynamicOptions (de la misma forma que atributo tableOptions)
   */

  tableOptions: TableDynamicOptions;

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
