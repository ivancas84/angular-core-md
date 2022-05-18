import { Component, Input, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
import { getControlName } from '@function/get-control-name';
import { isEmptyObject } from '@function/is-empty-object.function';
import { titleCase } from '@function/title-case';
import { startWith } from 'rxjs/operators';
 
export class LinkValueConfig extends FormControlConfig {
  override component: any = LinkValueComponent
  download: boolean = false
  prefix!: string
  sufix: string = ""
  target: string = ""
  title?: string


  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-link-value',
  templateUrl: './link-value.component.html',
})
export class LinkValueComponent implements OnInit {
  /**
   * Link que combine la ruta del config con el valor del input.
   */
  @Input() config: LinkValueConfig | {[key:string]: any} = {};
  @Input() control!: FormControl;

  href!: string

  ngOnInit(): void {
    console.log(this.control)
    if(!this.config.hasOwnProperty("component")) this.config = new LinkValueConfig(this.config)
  
    if(!this.config.title) this.config.title = this.control.value;

    this.href = this.config.prefix + this.control.value + this.config.sufix
  }
}
