import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FieldViewOptions } from '@class/field-view-options';
import { fastClone } from '@function/fast-clone';
 
@Component({
  selector: 'core-field-view-aux',
  templateUrl: './field-view-aux.component.html',
})
export class FieldViewAuxComponent implements OnChanges {
  
  /**
   * Auxiliar para Field View
   * Verifica caracteristicas "auxiliares" de FieldViewOptions 
   * para definir una "presentacion" auxiliar complementaria a FieldView 
   * Invoca luego a Field View
   */
  @Input() fieldViewOptions: FieldViewOptions; //opciones
  /**
   * Las opciones principales para definir enlaces son
   * routerLink: Ruta
   * queryParamField: Nombre del campo que sera utilizado como id para la ruta [queryParams]="{id:data[fieldViewOptions.queryParamField]}"
   */  
  
  @Input() data: { [index: string]: any }; //conjunto de campos
  /**
   * La visualizacion auxiliar de un campo utiliza datos adicionales que son indicados en fieldViewOptions
   */

  params: any = null;

  ngOnChanges(changes: SimpleChanges): void {

    /**
     * Se realiza una traduccion del atributo fieldViewOptions.aux.params que contienen [[key]]
     */
    if( changes["data"] && this.fieldViewOptions.aux && this.fieldViewOptions.aux.params ) {
      this.params = fastClone(this.fieldViewOptions.aux.params);
      for(var i in this.params){
        if(this.params.hasOwnProperty(i)){
          var key = this.params[i].match(/\{\{(.*?)\}\}/)
          if(key) this.params[i] = this.data[key[1]];
        }
      }
      
    }
  }
}
