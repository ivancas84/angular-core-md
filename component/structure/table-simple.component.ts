import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { FormArrayConfig } from '@class/reactive-form-config';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { Array2Component } from '@component/structure/array2.component';
import { StructureComponent } from '@component/structure/structure.component';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'core-table-simple',
  template: '',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export abstract class TableSimpleComponent extends Array2Component implements AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumns!: string[]; //columnas a visualizar

  override ngOnInit(): void {
    super.ngOnInit()
    this.initDisplayedColumns()
  }

  initDisplayedColumns() {
    this.displayedColumns = Object.keys(this.formGroup().controls)
  }

  ngAfterViewInit(): void {
    var s = this.control.valueChanges.pipe(
      //startWith(this.control.value),
      debounceTime(100),
      map(
        () => {
          if(this.table) this.table.renderRows()
        }
      )
    ).subscribe(
      () => {}
    );
    this.subscriptions.add(s)
  }
  
}



  
  
