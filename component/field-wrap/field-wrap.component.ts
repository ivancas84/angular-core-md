import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldWrapOptions } from '@class/field-wrap-options';
import { FormControlConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
 
@Component({
  selector: 'core-field-wrap',
  templateUrl: './field-wrap.component.html',
})
export class FieldWrapComponent implements OnInit{
  /**
   * Envoltura para visualizar el campo
   */
  
  @Input() config: FormControlConfig //configuracion
  @Input() field: FormControl //campo
  @Input() index: number = 0 //indice

  wrap: FieldWrapOptions
  ngOnInit(): void {
    if (Array.isArray(this.config.wrap) && this.index < this.config.wrap.length) this.wrap = this.config.wrap[this.index] 
    else if(this.index == 0) this.wrap = this.config.wrap

  }
  

}
