import { Input, OnInit, Component, AfterViewInit} from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, FormArray } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { fastClone } from '../../function/fast-clone';
import {ErrorStateMatcher} from '@angular/material/core';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'core-fieldset-array',
  template: '',
})
export abstract class FieldsetArrayComponent implements  OnInit  {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() form: FormGroup; 
  /**
   * Formulario padre
   */

  @Input() data$: Observable<any>; 
  /**
   * Datos del formulario
   */

  readonly entityName: string; 
  /**
   * entidad principal del componente  
   * Utilizado solo para identificar el fieldset
   */
  
  fieldset: FormArray; 
  /**
   * fieldset
   */

  protected subscriptions = new Subscription();

  readonly defaultValues: {[key:string]: any} = {};

  constructor(
    protected router: Router, 
    protected storage: SessionStorageService, 
  ) { }

  abstract formGroup();

  formValues = this.storage.getItem(this.router.url);

  ngOnInit() {    
    /**
     * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
     */
    this.initForm();
    var s = this.initData().subscribe(
      response => {
        this.initValues(response);
      }
    );
    this.subscriptions.add(s);
    /**
     * @todo no me suscribo desde el template porque dispara errores ExpressionChangedAfterIfCheckedValue
     * Un posible problema es que inicializo en null y despues asigno el valor a traves de reset o patchValue
     * Habria que ver si se puede efectuar todo el proceso de inicializacion del formulario y asignacion de valores en un mismo observable
     * Al suscribirse directamente en el ts no dispara los errores, se carga primero el formulario y despues se asigna el valor
     * Puede haber inconvenientes si se desea acceder al valueChanges en los subcomponentes,
     * la asignacion de datos iniciales no sera considerada como valueChange (se puede solucionar de la misma forma suscribiendose en el ts)
     */
  }

  initForm(): void {
    this.fieldset = new FormArray([]); //secretLairs as an empty FormArray
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


  initData(): Observable<any> {
    return of({}).pipe(switchMap(() => {
      if (this.formValues) {
        var d = this.formValues.hasOwnProperty(this.entityName)? this.formValues[this.entityName] : null;
        this.formValues = null;
        return of(d);
      }
      return this.data();
    }));
  }

  data(): Observable<any> {
    /**
     * Metodo independiente para facilitar reimplementacion
     */
    return this.data$;
  }

  initValues(response: {[key:string]: any}[] = []){
    this.fieldset.controls.length = 0; //inicializar
    for(var i = 0; i < response.length; i++){
      this.add();
      var res = fastClone(response[i]);
      this.fieldset.controls[i].reset(res);
    }
  }
 
}
