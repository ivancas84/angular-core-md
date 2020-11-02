import { Input, OnInit, Component, AfterViewInit, SimpleChanges} from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { FieldsetArrayComponent } from '@component/fieldset-array/fieldset-array.component';
import { mergeMap, switchMap } from 'rxjs/operators';
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

  readonly idName: string; //Nombre del identificador
  readonly idEntityName?: string; //Nombre de la entidad asociada al identificador
  idValue: string; //Valor del identificador
  load$: Observable<any>;
  load: boolean;
  data$: BehaviorSubject<any> = new BehaviorSubject(null);
  dataSource: any;
  
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
    this.initForm();
    this.load$ = this.data$.pipe(
      switchMap(
        data => { 
          var display = new Display();
          this.idValue = data;
          display.addParam(this.idName, this.idValue);
          return this.dd.all(this.entityName, display);
        }
      ),
      map(
        data => {
          var d = this.initData();
          this.initValues(d);
          return true;
        }
      )
    )
  }

  add() {
    var fg = this.formGroup();
    fg.reset(this.defaultValues); 
    if(fg.controls.hasOwnProperty(this.idName)) fg.get(this.idName).setValue(this.idValue);
    this.fieldset.push(fg);
  }
 
}
