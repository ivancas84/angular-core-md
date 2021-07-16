import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { OptEventIcon, OptLinkIcon, OptLinkText, OptRouteIcon, OptRouteText } from '@class/opt';
import { fastClone } from '@function/fast-clone';
 
@Component({
  selector: 'core-opt',
  templateUrl: './opt.component.html',
})
export class OptComponent implements OnChanges, OnInit { //3
  /**
   * Visualizar opciones
   */

  @Input() opt: OptRouteIcon
          | OptLinkIcon
          | OptRouteText
          | OptLinkText
          | OptEventIcon


  @Input() data: { [index: string]: any }; //conjunto de campos

  params: any = null;

  @Output() eventOpt: EventEmitter<any> = new EventEmitter();


  ngOnInit(): void {
    if(!this.opt.title) this.opt.title = this.opt.action;
  }
  
  ngOnChanges(changes: SimpleChanges): void {

    /**
     * Se realiza una traduccion del atributo opt.params que contienen {{key}}
     */

    if( changes["data"] && this.opt.params && this.data) {
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
    var $event = {action:this.opt.action, data:this.data}
    this.eventOpt.emit($event)
  }

  goToLink(){
    var p = "";
    for(var key in this.params) p += key + "=" + this.params[key]
    var action = (p.length) ? this.opt.action + "?" + p : this.opt.action
    window.open(action, this.opt["target"]);
}

}
