import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldHiddenOptions } from '@class/field-type-options';
import { FormArrayExt, FormControlExt } from '@class/reactive-form-ext';
import { SessionStorageService } from '@service/storage/session-storage.service';

@Component({
  selector:   'core-fieldset-array-dynamic',
  templateUrl: './fieldset-array-dynamic.component.html',
  styles:[`
    .item { padding:0px 10px;  }
  `]
})
export class FieldsetArrayDynamicComponent implements OnInit {
  /**
   * Componente dinamico de administración de fieldset array
   * La estructura por defecto del componente de implementacion es la misma que para FieldsetDynamicComponent, simplemente se debe cambiar la superclase
   **/

   @Input() fieldset: FormArrayExt; //formulario


   constructor(
     protected router: Router, 
   ) { }
  ngOnInit(): void {
console.log(this.fieldset)  }
 
   fg(index) { return this.fieldset.controls[index]; }
   /**
    * Metodo utilizado para indicar el formGroup en el template
    */
   
   add() {
     var fg = this.fieldset.factory.formGroup();
     fg.patchValue(this.fieldset.factory.formGroup().defaultValues()); 
     this.fieldset.push(fg); 
   }
 
   remove(index) { 
     if(!this.fieldset.controls[index].get("id").value) this.fieldset.removeAt(index); 
     else this.fieldset.controls[index].get("_delete").setValue(true);
   }
 
  _delete(index: number) { return this.fieldset.controls[index].get('_delete')}


  
}
