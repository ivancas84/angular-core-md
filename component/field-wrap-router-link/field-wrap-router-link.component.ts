import { Component, Input, OnInit, Type} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { FieldWrapComponent } from '@component/field-wrap/field-wrap.component';
import { fastClone } from '@function/fast-clone';

export class FieldWrapRouterLinkConfig extends FormControlConfig {
  componentId: string = "wrap_router_link"
  config: FormControlConfig 
  params: {} = {id:"{{id}}"}; //utilizar {{key}} para identificar valor del conjunto de datos
  path: string;

  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

@Component({
  selector: 'core-field-wrap-router-link',
  templateUrl: './field-wrap-router-link.component.html',
})
export class FieldWrapRouterLinkComponent extends FieldWrapComponent implements OnInit {
 
  @Input() config: FieldWrapRouterLinkConfig 
  @Input() control: FormControl 

  queryParams: any[];

  ngOnInit(): void {
    this.queryParams = fastClone(this.config.params);
    for(var i in this.config.params){
      if(this.config.params.hasOwnProperty(i)){
        var key = this.config.params[i].match(/\{\{(.*?)\}\}/)
        if(key) this.queryParams[i] = this.control.parent.controls[key[1]].value;
      }
      }
  }

}
