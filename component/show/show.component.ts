import { OnInit, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, BehaviorSubject, Subscription, forkJoin, of, Observable } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { Display } from '@class/display';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Component({
  selector: 'core-show',
  template: '',
})
export abstract class ShowComponent implements OnInit, OnDestroy {

  readonly entityName: string;
  /**
   * Nombre de la entidad principal
   */

  data$: ReplaySubject<any> = new ReplaySubject();
  /**
   * Datos principales
   */

  collectionSize$: ReplaySubject<number> = new ReplaySubject();
  /**
   * tamanio de la consulta
   * se hace coincidir el nombre con el paginador de ng-bootstrap
   */

  display$: BehaviorSubject<Display> = new BehaviorSubject(null);
  /**
   * Se define como BehaviorSubject para facilitar el acceso al valor actual evitando suscribirse continuamente
   * Se defibe como Observable porque es definida a traves de elementos asincronicos y puede variar su valor
   */

   display: Display;

   load$: Observable<any>;
   //load: boolean = false;

  //data: any;
  //collectionSize: number;

  protected subscriptions = new Subscription();

  constructor(
    protected dd: DataDefinitionService, 
    protected route: ActivatedRoute, 
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.load$ = this.route.queryParams.pipe(
      map(
        queryParams => {
          //this.load = false;
          var display = this.initDisplay(queryParams);
          this.display$.next(display);
        }
      ),
      mergeMap(
        () => {
          return this.initCount();
        }
      ),
      mergeMap(
        count => {
          this.collectionSize$.next(count);
          return this.initData(count)
        }
      ),
      map(
        data => {
          this.data$.next(data);
          //this.load = true;
          return true;
        }
      )
    );     
    /*
    var s = this.route.queryParams.subscribe(
      queryParams => {
        this.initDisplay(queryParams);
        this.initCount();
        this.initData();
      }
    );     
    this.subscriptions.add(s);*/ 
  }

  initCount() {
    return this.dd.count(this.entityName, this.display$.value)
  }

  initData(count){
    if(!count) return of([]); 
    return this.dd.all(this.entityName, this.display$.value); 
  }

  initDisplay(params: { [x: string]: any; }) {
    let display = new Display();
    display.setSize(100);
    display.setParamsByQueryParams(params);
    this.display = display;
    return display;
  }
  /*
  initCount(){ 
    this.dd.count(this.entityName, this.display$.value).pipe(first()).subscribe(
      count => { this.collectionSize$.next(count); }
    ) 
  }

  initData(){ 
    this.dd.all(this.entityName, this.display$.value).pipe(first()).subscribe(
      rows => { this.data$.next(rows); }
    );
  */

  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
