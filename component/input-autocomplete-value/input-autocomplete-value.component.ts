import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { map, startWith, mergeMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { FormControlConfig } from '@class/reactive-form-config';

export class InputAutocompleteValueConfig extends FormControlConfig{
  entityName!: string;
  fieldName!: string;

  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-input-autocomplete-value',
  templateUrl: './input-autocomplete-value.component.html',
})
export class InputAutocompleteValueComponent implements OnInit {
  /**
   * Input autocomplete reutilizable
   * Define un input independiente para facilitar la incorporacion de funcionalidad adicional (validación de seteo, clear, etc)
   */

  @Input() config!: InputAutocompleteValueConfig;
  @Input() control!: FormControl;

  filteredOptions!: Observable<Array<{[key:string]: any}>>;

  constructor(
    public dd: DataDefinitionService, 
  ) { }

  ngOnInit(): void {
    if(!this.config.label) this.config.label = this.config.fieldName;

    this.filteredOptions = this.control.valueChanges.pipe(
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
    display.addField(this.config.fieldName)    
    display.addCondition([this.config.fieldName,"=~",value]);
    display.setOrderByKeys([this.config.fieldName]);
    return this.dd.post("advanced", this.config.entityName, display).pipe(
      map(
        rows => arrayColumn(rows, this.config.fieldName)
      )
    );
  }

}
