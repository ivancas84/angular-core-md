import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
import { startWith } from 'rxjs/operators';
 
export class LinkTextConfig extends FormControlConfig {
  override component: any = LinkTextComponent
  download: boolean = false
  url!: string
  target!: string
  title: string = ""
  params: { [index: string]: any } = {}

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-link-text',
  templateUrl: './link-text.component.html',
})
export class LinkTextComponent implements OnInit {
  @Input() config!: LinkTextConfig;
  @Input() control!: FormControl;

  href!: string
  queryParams: any = {};


  ngOnInit(): void {
    if(!this.config.title && this.config.label) this.config.title = this.config.label;
    this.control.valueChanges.pipe(
        startWith(this.control.value)
      ).subscribe(
        value => {
          this.setQueryParams(value)
        }
      )
  }

  setQueryParams(value:{[key:string]:string}){
    this.queryParams = fastClone(this.config.params);
    for(var i in this.config.params){
      if(this.config.params.hasOwnProperty(i)){
        var key = this.config.params[i].match(/\{\{(.*?)\}\}/)
        if(key) this.queryParams[i] = value[key[1]];
      }
    }
    this.href = this.config.url + "?" + new URLSearchParams(this.queryParams).toString();
  }

}
