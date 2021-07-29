import { Input, OnInit, Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, of, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { startWith, mergeMap, debounceTime, distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';
import { Display } from '../../class/display';
import { DataDefinitionLabelService } from '@service/data-definition-label/data-definition-label.service';
import { emptyUrl } from '@function/empty-url.function';

@Component({
  selector: 'core-input-search-go',
  templateUrl: './input-search-go.component.html',
})
export class InputSearchGoComponent implements OnInit {
  /**
   * Busqueda y ruteo 
   */

  @Input() entityName: string;
  @Input() title?: string = "Buscar";
  @Input() route: string = emptyUrl(this.router.url);
  //@Input() queryParamsKey: string = "id";


  searchControl: FormControl = new FormControl();
  searchFailed: boolean = false;

  protected subscriptions = new Subscription();

  filteredOptions: Observable<Array<{[key:string]: any}>>;

  label: string;

  constructor(
    protected dd: DataDefinitionService,
    protected router: Router, 
    protected ddl: DataDefinitionLabelService
  ) { }


  displayFn(value): string {
    return value && value.label ? value.label : '';
  }
  
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
    display.addField("id")
    display.addField("label")
    display.addCondition(["_label_search","=~",value]);
    return this.dd.post("advanced",this.entityName, display);
  }

  
  

}
