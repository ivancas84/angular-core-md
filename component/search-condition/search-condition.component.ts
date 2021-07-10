import { Input, OnInit, Component} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Display } from '@class/display';

@Component({
  selector: 'core-search-condition',
  template: '',
})
export abstract class SearchConditionComponent implements OnInit {
  /**
   * Componente anidado de Search para definir busqueda a traves de condicion (display.condition) 
   */

  @Input() form: FormGroup; //formulario 
  @Input() display: Display; //datos de busqueda
  fieldset: FormArray; //fieldset para representar display.condition

  constructor( protected fb: FormBuilder ) { }

  ngOnInit() {  
    /**
     * Inicializar datos. 
     * Los valores por defecto se definen en el componente principal que utiliza el formulario de busqueda a traves del atributo display.
     */
     var c = this.display.getCondition()
     if(!isEmptyObject(c)) { 
       let elementsFGs: Array<FormGroup> = [];
       for(let i = 0; i < c.length; i++){
         let elFG = this.formGroup(c[i][0], c[i][1], c[i][2]);
         elementsFGs.push(elFG);
       }
       this.form.addControl('condition', this.fb.array(elementsFGs));
     }
  }

  formGroup(f: string = "", o: string ="=~", v: any = null): FormGroup {
    return this.fb.group({
      field: [f, {validators: [Validators.required]}],
      option: o,
      value: v,
    });
  }

 
  get elements(): FormArray { return this.form.get('condition') as FormArray; }
  add() { return this.elements.push(this.formGroup()); }
  remove(index) { return this.elements.removeAt(index); }

  f(i) { return this.elements.controls[i].get("field") }
  o(i) { return this.elements.controls[i].get("option") }
  v(i) { return this.elements.controls[i].get("value")  }

}
