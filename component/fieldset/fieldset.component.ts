import { Input, OnInit, Component, OnChanges, SimpleChanges} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { fastClone } from '../../function/fast-clone';

@Component({
  selector: 'core-fieldset',
  template: '',
})
export abstract class FieldsetComponent implements OnInit, OnChanges  {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() form: FormGroup; //formulario padre
  @Input() data: any; //datos del formulario
  @Input() entityName: string; //entidad principal del componente
  @Input() id?: string = this.entityName; //identificacion del fieldset
  /**
   * Para el caso de que se utilicen relaciones, 
   * la identificacion debe hacerse considerando los nombres de alias.
   * Por ejemplo, si la entidad principal es "toma", y se crea un fieldset para "docente",
   * entonces id = "doc-docente".
   * La api interpretara el valor de la relacion y seguira el orden correspondiente de persistencia
   */
  
  fieldset: FormGroup; //fieldset
  defaultValues: {[key:string]: any} = {};
  formValues = this.storage.getItem(this.router.url);
  /**
   * Al inicializar el formulario, en el padre se borran los valores del storage, 
   * por eso deben consultarte los valores del storage previamente
   */

  constructor(
    protected router: Router, 
    protected storage: SessionStorageService, 
  ) { }

  ngOnChanges(changes: SimpleChanges): void {    
    if(!changes["data"].isFirstChange()){ //el firstChange es tratado en el ngOnInit
      var data = this.initData();
      var values = this.initValues(data);
      this.resetForm(values);
    }
  }

  ngOnInit() {    
    this.initForm();
    var data = this.initData();
    var values = this.initValues(data);
    this.resetForm(values);
  }

  formGroup() { return new FormGroup({}); }

  initForm(): void {
    this.fieldset = this.formGroup();
    this.form.addControl(this.id, this.fieldset);
  }

  initData(): any {
    if (this.formValues) {
      var d = this.formValues.hasOwnProperty(this.id)? this.formValues[this.id] : null;
      this.formValues = null;
      return d;
    }
    return this.data;
  }

  initValues(response: {[key:string]: any} = {}){
    if(!response) return this.defaultValues;
    var res = fastClone(response);
    for(var key in this.defaultValues){
      if(this.defaultValues.hasOwnProperty(key)){
        if(!res.hasOwnProperty(key)) res[key] = this.defaultValues[key];
      }
    }
    return res;
  }

  resetForm(values: {[key:string]: any}){
    this.fieldset.reset(values) 
  }

}
