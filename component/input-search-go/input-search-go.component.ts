import { Input, OnInit, Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { startWith, mergeMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Display } from '../../class/display';
import { emptyUrl } from '@function/empty-url.function';

@Component({
  selector: 'core-input-search-go',
  templateUrl: './input-search-go.component.html',
})
export class InputSearchGoComponent implements OnInit {
  /**
   * Componente principal para búsqueda y ruteo 
   */

  @Input() entity_name!: string;
  @Input() label: string = "Buscar";
  @Input() route: string = emptyUrl(this.router.url);
  @Input() field_name: string = "id";

  //@Input() queryParamsKey: string = "id";


  searchControl: FormControl = new FormControl();
  searchFailed: boolean = false;

  protected subscriptions = new Subscription();

  filteredOptions!: Observable<Array<{[key:string]: any}>>;

  constructor(
    protected dd: DataDefinitionService,
    protected router: Router, 
  ) { }


  displayFn(value: { label: string; }): string {
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
          var qp: { [x: string]: any } = {}
          qp[this.field_name] = value.id
          this.router.navigate([this.route],{queryParams: qp});
          return of([])
        }
      })
    )
  }
  
  private _filter(value: string): Observable<any> {
    if(value === "") return of([]);
    var display = new Display().setFields_(["id","label"]).addCondition(["label_search","=~",value]);
    return this.dd.post("select",this.entity_name, display);
  }

  
  

}
