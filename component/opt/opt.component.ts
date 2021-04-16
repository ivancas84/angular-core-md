import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { OptLinkIcon, OptLinkText, OptRouteIcon, OptRouteText } from '@class/opt';
import { fastClone } from '@function/fast-clone';
 
@Component({
  selector: 'core-opt',
  templateUrl: './opt.component.html',
})
export class OptComponent implements OnChanges{
  /**
   * Visualizar opciones de columna
   * @todo (en construccion) sera utilizado posteriormente en core-table-dynamic
   */

  /*@Input() path: string ;
  @Input() label: string;
  @Input() params: string;
  @Input() icon: string;*/
  @Input() opt: OptRouteIcon
          | OptLinkIcon
          | OptRouteText
          | OptLinkText


  @Input() data: { [index: string]: any }; //conjunto de campos

  params: any = null;

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
}
