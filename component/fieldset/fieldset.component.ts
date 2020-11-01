import { Input, OnInit, Component, OnChanges, SimpleChanges} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { fastClone } from '../../function/fast-clone';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'core-fieldset',
  template: '',
})
export abstract class FieldsetComponent implements  OnInit, OnChanges  {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() form: FormGroup; 
  /**
   * Formulario padre
   */

  @Input() data: any; 
  /**
   * Datos del formulario
   */

  readonly entityName: string; 
  /**
   * entidad principal del componente  
   * Utilizado solo para identificar el fieldset
   */
  
  fieldset: FormGroup; 
  /**
   * fieldset
   */

  protected subscriptions = new Subscription();
  /**
   * las subscripciones son almacenadas para desuscribirse (solucion temporal al bug de Angular)
   * @todo En versiones posteriores de angular, eliminar el atributo subscriptions y su uso
   */

  readonly defaultValues: {[key:string]: any} = {};

  constructor(
    protected router: Router, 
    protected storage: SessionStorageService, 
  ) { }


  ngOnChanges(changes: SimpleChanges): void {    
    if(!changes["data"].isFirstChange()){ //el firstChange es tratado en el ngOnInit
      var data = this.initData();
      this.initValues(data);
    }
  }

  abstract formGroup();

  formValues =this.storage.getItem(this.router.url);

  ngOnInit() {    
    /**
     * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
     */
    this.initForm();
    var data = this.initData();
    this.initValues(data);
  }

  initForm(): void {
    this.fieldset = this.formGroup();
    this.form.addControl(this.entityName, this.fieldset);
  }

  initData(): any {
    if (this.formValues) {
      var d = this.formValues.hasOwnProperty(this.entityName)? this.formValues[this.entityName] : null;
      this.formValues = null;
      return d;
    }
    return this.data;
  }

 

  initValues(response: {[key:string]: any} = {}){
    if(!response) {
      this.fieldset.reset(this.defaultValues);
    } else {
      var res = fastClone(response);
      for(var key in this.defaultValues){
        if(this.defaultValues.hasOwnProperty(key)){
          if(!res.hasOwnProperty(key)) res[key] = this.defaultValues[key];
        }
      }
      this.fieldset.reset(res) 
    }
  }

}
