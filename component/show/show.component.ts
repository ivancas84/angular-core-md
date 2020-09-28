import { OnInit, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
          this.initDisplay(queryParams);

          return this.initData().pipe(
            map(
              () => {return this.load = true;}
            )
          )
        }
      )
    );
  }


  initData(){
    /**
     * Se define un metodo independiente para definir la cantidad total y los datos a mostrar
     * Facilita la cancelacion de la cantidad
     */
    return this.setCount().pipe(
      switchMap(
        count => {
          this.collectionSize$.next(count)
          return this.setData().pipe(
            map(
              data => {
                this.data$.next(data);                
              }
            )
          )
        }
      )
    )
  } 

  setCount() {
    return this.dd.count(this.entityName, this.display);
  }

  setData(){
    /**
     * Conviene no pasar como parametro el valor de collectionSize$
     * puede que se desee que este valor sea opcional al sobrescribir el metodo
     */
    if(!this.collectionSize$.value) return of([]); 
    return this.dd.all(this.entityName, this.display);
  }

  initDisplay(params: { [x: string]: any; }) {
    this.display = new Display();
    this.display.setSize(100);
    this.display.setParamsByQueryParams(params);
    this.display$.next(this.display); //@todo reemplazar uso de display$ por display
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
