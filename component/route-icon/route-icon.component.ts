import { Component, Input, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
import { startWith } from 'rxjs/operators';
 
export class RouteIconConfig extends FormControlConfig {
  override component: any = RouteIconComponent
  icon: string = "info"
  routerLink!: string
  color: string = ""
  target!: string
  title: string = ""
  params: { [index: string]: any } = {}
  /**
   * @example 
   *   params: {
   *     comision:"{{id}}"
   *     descripcion:"{{alumno}}"
   *   }
   * 
   * @description
   * El atributo control corresponde a un FormGroup formado por controls.
   * Para utilizar un valor particular de controls, se debe indicar entre doble llaves.
   * En el ejemplo se utilizara control.value["id"] y control.value["alumno"]
   * Asegurarse de que el atributo incluido exista en el conjunto de valores de control
   */

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
  @Input() config!: RouteIconConfig;
  @Input() control!: FormGroup;

  queryParams: any = {};
  /**
   * Reconfiguracion de config.params
   * En base al valor de config.params se define queryParams evitando editar config.params
   * queryParams es directamente utilizado en el template
   */

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

  setQueryParams(value: {[key:string]:string}){
    this.queryParams = fastClone(this.config.params);
    for(var i in this.config.params){
      if(this.config.params.hasOwnProperty(i)){
        var key = this.config.params[i].match(/\{\{(.*?)\}\}/)
        if(key) this.queryParams[i] = value[key[1]];
      }
    }
  }
}
