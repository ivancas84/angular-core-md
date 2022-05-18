import { Component, Input, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
import { getControlName } from '@function/get-control-name';
import { isEmptyObject } from '@function/is-empty-object.function';
import { titleCase } from '@function/title-case';
import { startWith } from 'rxjs/operators';
 
export class LinkTextConfig extends FormControlConfig {
  override component: any = LinkTextComponent
  download: boolean = false
  url!: string
  target: string = ""
  title: string = ""
  override label: string = "Acceder"
  params: { [index: string]: any } = {}
  /**
   * Para definir valores del control, utilizar la sintaxis con doble llave
   * 
   * 
   * @example {'nombre':{{nombre2}}}
   * se asignara el valor control.controls['nombre2'] 
   */

  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-link-text',
  templateUrl: './link-text.component.html',
})
/**
 * @deprecated Desarrollar componente FieldWrapValueLinkComponent!!!
 */
export class LinkTextComponent implements OnInit {
  @Input() config: LinkTextConfig | {[key:string]: any} = {};
  @Input() control!: FormGroup;

  href!: string
  queryParams: any = {};


  ngOnInit(): void {
    if(!this.config.hasOwnProperty("component")) this.config = new LinkTextConfig(this.config)

    if(!this.config.label) {
      var n = getControlName(this.control)
      this.config.label = titleCase(n!.substring(n!.indexOf("-")+1).replace("_"," "))
    }
  
    if(!this.config.title) this.config.title = this.config.label;
    this.queryParams = fastClone(this.config.params);

    if(this.control && !isEmptyObject(this.config.params))
      this.control.valueChanges.pipe(
        startWith(this.control.value)
      ).subscribe(
        value => {
          for(var i in this.config.params){
            if(this.config.params.hasOwnProperty(i)){
              var key = this.config.params[i].match(/\{\{(.*?)\}\}/)
              if(key) this.queryParams[i] = value[key[1]];
            }
          }
        }
      )

    this.href = this.config.url 
    if(!isEmptyObject(this.queryParams)) this.href += "?" + new URLSearchParams(this.queryParams).toString();
  }
}
