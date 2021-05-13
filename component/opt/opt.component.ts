import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { OptLinkIcon, OptLinkText, OptRouteIcon, OptRouteText } from '@class/opt';
import { fastClone } from '@function/fast-clone';
 
@Component({
  selector: 'core-opt',
  templateUrl: './opt.component.html',
})
export class OptComponent implements OnChanges{ //3
  /**
   * Visualizar opciones de columna
   */

  @Input() opt: OptRouteIcon
          | OptLinkIcon
          | OptRouteText
          | OptLinkText


  @Input() data: { [index: string]: any }; //conjunto de campos
  @Input() index: number; //indice (evitar utilizarlo, si se realiza ordenamiento de la tabla utilizando angular, no se reflejan los datos en la general)
  

  params: any = null;

  @Output() eventOpt: EventEmitter<any> = new EventEmitter();


  ngOnChanges(changes: SimpleChanges): void {

    /**
     * Se realiza una traduccion del atributo fieldViewOptions.aux.params que contienen {{key}}
     */

    if( changes["data"] && this.opt.params ) {
      this.params = fastClone(this.opt.params);
      for(var i in this.params){
        if(this.params.hasOwnProperty(i)){
          var key = this.params[i].match(/\{\{(.*?)\}\}/)
          if(key) this.params[i] = this.data[key[1]];
        }
      }
    }
  }

  emitEventOpt(){
    var $event = {index:this.index, action:this.opt.action, data:this.data}
    this.eventOpt.emit($event)
  }

}
