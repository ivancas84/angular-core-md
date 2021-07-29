import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { OptEventIcon, OptLinkIcon, OptLinkText, OptRouteIcon, OptRouteText } from '@class/opt';
import { FormControlExt, FormGroupExt } from '@class/reactive-form-ext';
import { startWith } from 'rxjs/operators';
 
@Component({
  selector: 'core-opt',
  templateUrl: './opt.component.html',
})
export class OptComponent implements OnInit { //3
  /**
   * Visualizar opciones
   */

  @Input() opt: OptRouteIcon
          | OptLinkIcon
          | OptRouteText
          | OptLinkText
          | OptEventIcon


  //@Input() data?: FormGroupExt;

  params: any = null;

  @Output() eventOpt: EventEmitter<any> = new EventEmitter();


  ngOnInit(): void {
    if(!this.opt.title) this.opt.title = this.opt.action;

    
    if(this.opt.data && this.opt.params){
      this.opt.data.valueChanges.pipe(
        startWith(this.opt.data.value)
      ).subscribe(
        () => {
          this.params = this.opt.data.matchParams(this.opt.params)
        }
      )
    }
  }


  emitEventOpt(){
    var $event = {action:this.opt.action, data:this.opt.data}
    this.eventOpt.emit($event)
  }

  goToLink(){
    var p = "";
    for(var key in this.params) p += key + "=" + this.params[key]
    var action = (p.length) ? this.opt.action + "?" + p : this.opt.action
    window.open(action, this.opt["target"]);
}

}
