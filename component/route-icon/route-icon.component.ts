import { Component, Input, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
import { startWith } from 'rxjs/operators';
 
export class RouteIconConfig extends FormControlConfig {
  componentId: string = "route_icon"
  icon: string
  routerLink: string
  color: string
  target: string
  title?: string
  params: { [index: string]: any } = {}
  disabled: false

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-route-icon',
  templateUrl: './route-icon.component.html',
})
export class RouteIconComponent implements ControlComponent, OnInit {
  @Input() config: RouteIconConfig;
  @Input() control: FormGroup;

  queryParams: any = {};

  ngOnInit(): void {
    if(!this.config.title) this.config.title = this.config.routerLink;
  
    
    this.control.valueChanges.pipe(
        startWith(this.control.value)
      ).subscribe(
        value => {
          this.setQueryParams(value)
        }
      )
  }

  setQueryParams(value){
    this.queryParams = fastClone(this.config.params);
    for(var i in this.config.params){
      if(this.config.params.hasOwnProperty(i)){
        var key = this.config.params[i].match(/\{\{(.*?)\}\}/)
        if(key) this.queryParams[i] = value[key[1]];
      }
    }

  }
}
