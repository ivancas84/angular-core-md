import { Input, OnInit, Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { startWith, mergeMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Display } from '../../class/display';

@Component({
  selector: 'app-input-search-go',
  templateUrl: './input-search-go.component.html',
})
export class InputSearchGoComponent implements  OnInit {
  /**
   * Busqueda y ruteo 
   */

  @Input() entityName: string;
  @Input() title?: string = "Buscar";
  @Input() route: string;

  searchControl: FormControl = new FormControl();
  searchFailed: boolean = false;

  protected subscriptions = new Subscription();

  filteredOptions: Observable<Array<{[key:string]: any}>>;

  constructor(
    protected dd: DataDefinitionService,
    protected router: Router, 
  ) { }

  ngOnInit(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      distinctUntilChanged(),
      mergeMap(value => {
        if (typeof value == "string" ) return this._filter(value)
        else {
          this.router.navigate([this.route],{queryParams: {id:value.id}});
          return of([])
        }
      })
    )
  }
  
  private _filter(value: string): Observable<any> {
    if(value === "") return of([]);
    var display = new Display();
    display.addCondition(["_label_search","=~",value]);
    return this.dd.all(this.entityName, display);
  }

  
  

}
