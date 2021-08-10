import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';

@Component({
  selector: 'core-field-wrap-router-link',
  templateUrl: './field-wrap-router-link.component.html',
})
export class FieldWrapRouterLinkComponent implements OnInit {
 
  @Input() field: FormControl;
  @Input() config: FormControlConfig;
  @Input() params: any[];
  @Input() path: string;
  queryParams: any[];


  ngOnInit(): void {
    this.queryParams = fastClone(this.params);
    for(var i in this.params){
      if(this.params.hasOwnProperty(i)){
        var key = this.params[i].match(/\{\{(.*?)\}\}/)
        if(key) this.queryParams[i] = this.field.parent.controls[key[1]].value;
      }
      }
  }

}
