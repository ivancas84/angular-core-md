import { Component, Input, OnInit, Type} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { startWith } from 'rxjs/operators';
 
export class LinkTextConfig extends FormControlConfig {
  componentId: string = "link_text"
  download: boolean = false
  prefix: string
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
  selector: 'core-link-text',
  templateUrl: './link-text.component.html',
})
export class LinkTextComponent implements ControlComponent, OnInit {
  @Input() config: LinkTextConfig;
  @Input() control: FormControl;

  href: string

  ngOnInit(): void {
    this.control.valueChanges.pipe(
        startWith(this.control.value)
      ).subscribe(
        value => {
          this.href = this.config.prefix+value
          //this.queryParams[this.key] = this.field.value
        }
      )
  }
}
