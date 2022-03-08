import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FormArrayConfig, FormConfig } from '@class/reactive-form-config';
import { FormConfigService } from '@service/form-config/form-config.service';

/**
 * EN CONSTRUCCION
 */
export class FieldsetArrayDynamicConfig extends FormArrayConfig {
  component:any = FieldsetArrayDynamicComponent
  title?: string;
  // entityName?: string;
  // intro?: string;
  // optTitle: FormConfig[] = []; //opciones de titulo

  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector:   'core-fieldset-array-dynamic',
  templateUrl: './fieldset-array-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
  `]
})
export class FieldsetArrayDynamicComponent {
  /**
   * Componente dinamico de administración de fieldset array
   * La estructura por defecto del componente de implementacion es la misma que para FieldsetDynamicComponent, simplemente se debe cambiar la superclase
   **/
  @Input() config: FieldsetArrayDynamicConfig;
  @Input() control: FormArray;

  constructor(
    protected fc: FormConfigService
  ) { }
  

  fg(index) { return this.control.controls[index]; }
  /**
   * Metodo utilizado para indicar el formGroup en el template
   */
   
  
  add() {
    var fg = this.config.factory.formGroup();
    this.control.push(fg); 
  }
 
  remove(index) { 
    if(!this.control.controls[index].get("id").value) this.control.removeAt(index); 
    else this.control.controls[index].get("_controller").setValue("delete");
  }

  _controller(index: number) { return this.control.controls[index].get('_controller')}
  
}
