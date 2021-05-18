import { Input, OnInit, Component, SimpleChanges} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { fastClone } from '../../function/fast-clone';

@Component({
  selector: 'core-fieldset-array',
  template: '',
})
export abstract class FieldsetArrayComponent implements OnInit  {
  /**
   * Componente de administración de fieldset.
   * El formulario principal y los datos principales son definidos en componente principal  
   * Define un formGroup (fieldset) y lo agrega al formulario principal dinámicamente
   */

  entityName: string; //nombre de la entidad
  @Input() form: FormGroup; //formulario
  @Input() data: any; //datos
  @Input() fieldsetId: string; //identificacion del formulario  
  /*
   * Utilizado para identificar el fieldset
   */

  fieldset: FormArray; //fieldset
  defaultValues: {[key:string]: any} = {};
  formValues = this.storage.getItem(this.router.url);
  /**
   * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
   * En AdminComponent se explica por qué es necesario blanquear los valores del storage al inicializar? Se explica
   */

  constructor(
    protected router: Router, 
    protected storage: SessionStorageService, 
  ) { }

  abstract formGroup();

  ngOnChanges(changes: SimpleChanges): void {    
    if(!changes["data"].isFirstChange()){ 
      /**
       * El firstChange es tratado en el ngOnInit porque es necesario inicializar el fieldset antes de asignar
       */
      var formValues = this.initFormValues();
      this.setFormValues(formValues);
    }
  }
  
  ngOnInit() {
    this.initForm();
    var data = this.initFormValues();
    this.setFormValues(data);
  }

  initForm(): void {
    this.fieldset = new FormArray([]);
    this.form.addControl(this.fieldsetId, this.fieldset);
  }

  fg(index) { return this.fieldset.controls[index]; }
  /**
   * Metodo utilizado para indicar el formGroup en el template
   */
  
  add() {
    var fg = this.formGroup();
    fg.reset(this.defaultValues); 
    this.fieldset.push(fg); 
  }

  remove(index) { 
    if(!this.fieldset.controls[index].get("id").value) this.fieldset.removeAt(index); 
    else this.fieldset.controls[index].get("_delete").setValue(true);
  }

  initFormValues(): any {
    if (this.formValues) {
      var d = this.formValues.hasOwnProperty(this.fieldsetId)? this.formValues[this.fieldsetId] : null;
      this.formValues = null; //@todo analizar si es necesario inicializar formValues
      return d;
    }
    return this.data;
  }

  setFormValues(response: {[key:string]: any}[] = []){
    this.fieldset.controls.length = 0; //inicializar
    for(var i = 0; i < response.length; i++){
      this.add();
      var res = fastClone(response[i]);
      this.fieldset.controls[i].reset(res);
    }
  }
 
}
