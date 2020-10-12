import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { map, startWith, mergeMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';


@Component({
  selector: 'core-input-autocomplete-value',
  templateUrl: './input-autocomplete-value.component.html',
})
export class InputAutocompleteValueComponent implements OnInit {
  /**
   * Input autocomplete reutilizable
   * Define un input independiente para facilitar la incorporacion de funcionalidad adicional (validación de seteo, clear, etc)
   */

  @Input() field: FormControl;
  @Input() entityName: string;
  @Input() fieldName: string;
  @Input() title?: string;

  filteredOptions: Observable<Array<{[key:string]: any}>>;

  constructor(
    public dd: DataDefinitionService, 
  ) { }

  ngOnInit(): void {
    if(!this.title) this.title = this.fieldName;

    this.filteredOptions = this.field.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      distinctUntilChanged(),
      mergeMap(value => {
        if (typeof value == "string" ) return this._filter(value)
        else {
          return of([])
        }
      })
    )
  }

  private _filter(value: string): Observable<any> {
    if(value === "") return of([]);
    var display = new Display();
    display.addField(this.fieldName)    
    display.addCondition([this.fieldName,"=~",value]);
    display.setOrderByKeys([this.fieldName]);
    return this.dd.post("advanced", this.entityName, display).pipe(
      map(
        rows => arrayColumn(rows, this.fieldName)
      )
    );
  }

}
