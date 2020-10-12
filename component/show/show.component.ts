import { OnInit, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, of, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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

  data$: BehaviorSubject<any> = new BehaviorSubject([]);
  /**
   * Datos principales
   */

  collectionSize$: BehaviorSubject<number> = new BehaviorSubject(0);
  /**
   * tamanio de la consulta
   * se hace coincidir el nombre con el paginador de ng-bootstrap
   */

  display$: BehaviorSubject<Display> = new BehaviorSubject(null);
  /**
   * @todo reemplazar valor asincronico por sincronico
   * Se define por elementos asincronicos, es necesario que sea asincronico?
   */

   display: Display;
   params: { [x: string]: any; }

   load$: Observable<any>;
   load: boolean = false;
   /**
    * Atributo auxiliar necesario para visualizar la barra de carga
    */

  protected subscriptions = new Subscription();

  constructor(
    protected dd: DataDefinitionService, 
    protected route: ActivatedRoute, 
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.load$ = this.route.queryParams.pipe(
      switchMap(
        queryParams => {
          this.load = false;
          this.params = queryParams;       
          this.initDisplay();

          return this.initData().pipe(
            map(
              () => {
                return this.load = true;              
              }
            )
          )
        }
      )
    );
  }


  initData(): Observable<any>{
    /**
     * Se define un metodo independiente para definir la cantidad total y los datos a mostrar
     * Facilita la cancelacion de la cantidad
     */
    return this.count().pipe(
      switchMap(
        count => {
          this.collectionSize$.next(count)
          return this.data().pipe(
            tap(
              data => {
                this.data$.next(data);
              }
            )
          )
        }
      )
    )
  } 

  count(): Observable<any> {
    return this.dd.post("count", this.entityName, this.display);
  }

  data(): Observable<any>{
    /**
     * Conviene no pasar como parametro el valor de collectionSize$
     * puede que se desee que este valor sea opcional al sobrescribir el metodo
     */
    if(!this.collectionSize$.value) return of([]); 
    return this.dd.all(this.entityName, this.display);
  }

  initDisplay() {
    this.display = new Display();
    this.display.setSize(100);
    this.display.setParamsByQueryParams(this.params);
    this.display$.next(this.display); //@todo reemplazar uso de display$ por display
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
