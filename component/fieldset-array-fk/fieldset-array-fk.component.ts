import { Input, OnInit, Component, AfterViewInit} from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, FormArray } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/storage/session-storage.service';
import { fastClone } from '../../function/fast-clone';
import {ErrorStateMatcher} from '@angular/material/core';
import { FieldsetArrayComponent } from '@component/fieldset-array/fieldset-array.component';
import { mergeMap } from 'rxjs/operators';
import { Display } from '@class/display';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';


@Component({
  selector: 'core-fieldset-array-fk',
  template: '',
})
export abstract class FieldsetArrayFkComponent extends FieldsetArrayComponent  {
  /**
   * Variante del FieldsetArrayComponent que inicializa los datos a partir del valor de una fk
   */

  readonly fkName: string;
  
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
          display.addParam(this.fkName, response);
          return this.dd.all(this.entityName, display);
        }
      )
    );
  }
 
}
