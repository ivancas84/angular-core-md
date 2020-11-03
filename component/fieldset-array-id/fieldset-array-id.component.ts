import { Component, SimpleChanges} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { FieldsetArrayComponent } from '@component/fieldset-array/fieldset-array.component';
import { switchMap } from 'rxjs/operators';
import { Display } from '@class/display';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'core-fieldset-array-id',
  template: '',
})
export abstract class FieldsetArrayIdComponent extends FieldsetArrayComponent  {
  /**
   * Variante del FieldsetArrayComponent que inicializa los datos a partir del valor de un identificador
   * El identificador habitualmente es una fk, pero no es estrictamente necesario
   */

  readonly idName: string; //nombre del identificador
  readonly idEntityName?: string; //nombre de la entidad asociada al identificador
  idValue: string; //valor del identificador
  load$: Observable<any>; //suscripcion desde el template
  data$: BehaviorSubject<any> = new BehaviorSubject(null); //facilitar encadenamiento de observables
  dataSource: any; //auxiliar de data
  protected subscriptions = new Subscription(); //suscripciones en el ts

  constructor(
    protected router: Router, 
    protected storage: SessionStorageService, 

    protected dd: DataDefinitionService,
    protected dialog: MatDialog,
  ) { 
    super(router, storage)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if( changes['data'] && changes['data'].previousValue != changes['data'].currentValue ) {    
        this.data$.next(changes['data'].currentValue);
    }
  }

  ngOnInit(): void {
    //@todo habria que chequear primero el storage y despues consultar los datos
    this.initForm();

    var s = this.data$.pipe(
      switchMap(
        data => { 
          
          this.idValue = data;
          return this.initData();
        }
      ),
    ).subscribe(
        data => {
          this.dataSource = data;
          var d = this.initFormValues();
          this.setFormValues(d);
        }
    )
    this.subscriptions.add(s);

    /**
     * @todo Si bien no tiene mucho sentido, se realiza la subscripcion en el ts 
     * en vez del template para evitar errores ExpressionChangedAfterItHasBeenCheckedError.
     * Los errores ExpressionChangedAfterItHasBeenCheckedError 
     * ocurren cuando se retorna a la pagina,
     * no suceden cuando se carga por primera vez.
     */
  }

  initData(): Observable<any>{
    var display = new Display();
    display.addParam(this.idName, this.idValue);
    return this.dd.all(this.entityName, display);
  }

  initFormValues(): any {
    if (this.formValues) {
      var d = this.formValues.hasOwnProperty(this.entityName)? this.formValues[this.entityName] : null;
      this.formValues = null;
      return d;
    }
    return this.dataSource;
  }

  add() {
    var fg = this.formGroup();
    fg.reset(this.defaultValues); 
    if(fg.controls.hasOwnProperty(this.idName)) fg.get(this.idName).setValue(this.idValue);
    this.fieldset.push(fg);
  }
 
}
