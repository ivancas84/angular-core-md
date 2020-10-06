import { Input, OnInit, Component, AfterViewInit} from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { FieldsetArrayComponent } from '@component/fieldset-array/fieldset-array.component';
import { mergeMap } from 'rxjs/operators';
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

  constructor(
    protected router: Router, 
    protected storage: SessionStorageService, 

    protected dd: DataDefinitionService,
    protected dialog: MatDialog,
  ) { 
    super(router, storage)
  }

  data(): Observable<any> {
    return this.data$.pipe(
      mergeMap(
        response => {                    
          var display = new Display();
          this.idValue = response;
          display.addParam(this.idName, response);
          return this.dd.all(this.entityName, display);
        }
      )
    );
  }

  add() {
    var fg = this.formGroup();
    fg.reset(this.defaultValues); 
    if(fg.controls.hasOwnProperty(this.idName)) fg.get(this.idName).setValue(this.idValue);
    this.fieldset.push(fg);
  }
 
}
