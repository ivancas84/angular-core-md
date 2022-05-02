import { Component, Input, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { FieldWrapComponent } from '@component/field-wrap/field-wrap.component';
import { fastClone } from '@function/fast-clone';

export class FieldWrapRouterLinkConfig extends FormControlConfig {
  override component: any = FieldWrapRouterLinkComponent
  config!: FormControlConfig 
  params: {[key: string]: string}  = {id:"{{id}}"}; //utilizar {{key}} para identificar valor del conjunto de datos
  path!: string;

  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-field-wrap-router-link',
  templateUrl: './field-wrap-router-link.component.html',
})
export class FieldWrapRouterLinkComponent extends FieldWrapComponent implements OnInit {
 
  @Input() override config!: FieldWrapRouterLinkConfig 
  @Input() override control!: FormControl 

  queryParams!:  {[key: string]: string};

  ngOnInit(): void {
    this.queryParams = fastClone(this.config.params);
    for(var i in this.config.params){
      if(this.config.params.hasOwnProperty(i)){
        var key = this.config.params[i].match(/\{\{(.*?)\}\}/)
        if(this.control.parent){
          var p = this.control.parent as FormGroup;
          if(key && p) this.queryParams[i] = p.controls[key[1]].value;
        }
      }
    }
  }

}
