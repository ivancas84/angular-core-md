import { FormArray } from "@angular/forms";
import { MatTable } from "@angular/material/table";
import { Subscription, debounceTime, map } from "rxjs";

 /**
   * @example
   * ngAfterViewInit(): void {
   *   this.subscriptions.add(
   *     this.ts.renderRowsOfTableOnValueChanges(this.control, this.table)
   *   )
   * }
   */
  export function renderRowsOfTableOnValueChanges(control: FormArray, table: MatTable<any>): Subscription {
    return control.valueChanges.pipe(
      //startWith(this.control.value),
      debounceTime(100),
      map(
        () => {
          if(table) table.renderRows()
        }
      )
    ).subscribe(
      () => {}
    );
  }

