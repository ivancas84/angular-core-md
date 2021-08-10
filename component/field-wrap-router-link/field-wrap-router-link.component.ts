import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { FieldWrapComponent } from '@component/field-wrap/field-wrap.component';
import { fastClone } from '@function/fast-clone';

@Component({
  selector: 'core-field-wrap-router-link',
  templateUrl: './field-wrap-router-link.component.html',
})
export class FieldWrapRouterLinkComponent   extends FieldWrapComponent implements OnInit {
 
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
