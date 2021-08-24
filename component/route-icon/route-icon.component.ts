import { Component, Input, OnInit, Type} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { startWith } from 'rxjs/operators';
 
export class RouteIconConfig extends FormControlConfig {
  componentId: string = "route_icon"
  icon: string
  routerLink: string
  key: string
  color: string
  target: string
  title?: string

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
  selector: 'core-route-icon',
  templateUrl: './route-icon.component.html',
})
export class RouteIconComponent implements ControlComponent, OnInit {
  @Input() config: RouteIconConfig;
  @Input() control: FormControl;


  queryParams: any = {};

  ngOnInit(): void {
    if(!this.config.title) this.config.title = this.config.routerLink;
    
    this.control.valueChanges.pipe(
        startWith(this.control.value)
      ).subscribe(
        () => {
          this.queryParams[this.config.key] = this.control.value
        }
      )
  }
}
