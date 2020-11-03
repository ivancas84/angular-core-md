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
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() form: FormGroup; //formulario padre
  @Input() data: any; //datos del formulario
  fieldset: FormArray; //fieldset
  readonly entityName: string; //entidad principal del componente  
   /*
   * Utilizado para identificar el fieldset
   */
  readonly defaultValues: {[key:string]: any} = {};
  formValues = this.storage.getItem(this.router.url);

  constructor(
    protected router: Router, 
    protected storage: SessionStorageService, 
  ) { }

  abstract formGroup();

  ngOnChanges(changes: SimpleChanges): void {    
    if(!changes["data"].isFirstChange()){ //el firstChange es tratado en el ngOnInit
      var formValues = this.initFormValues();
      this.setFormValues(formValues);
    }
  }
  
  ngOnInit() {    
    /**
     * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
     */
    this.initForm();
    var data = this.initFormValues();
    this.setFormValues(data);
  }

  initForm(): void {
    this.fieldset = new FormArray([]);
    this.form.addControl(this.entityName, this.fieldset);
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
      var d = this.formValues.hasOwnProperty(this.entityName)? this.formValues[this.entityName] : null;
      this.formValues = null;
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
