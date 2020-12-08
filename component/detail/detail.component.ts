import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { isEmptyObject } from '../../function/is-empty-object.function';
import { OnInit,  Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fastClone } from '@function/fast-clone';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';

@Component({
  selector: 'core-detail',
  template: '',
})
export abstract class DetailComponent implements OnInit {
/**
 * Detalle
 */

  readonly entityName: string; //entidad principal
  display$:BehaviorSubject<any> = new BehaviorSubject(null); //parametros de consulta
  data: any; //datos principales

  loadParams$: Observable<any>; //carga de parametros
  loadDisplay$: Observable<any>; //carga de display
  protected subscriptions = new Subscription(); //suscripciones en el ts

  constructor(
    protected route: ActivatedRoute, 
    protected location: Location, 
    protected dd: DataDefinitionService, 
    protected dialog: MatDialog,
  ) {}
  
  
  ngOnInit() {
    this.loadParams();  
    this.loadDisplay();
  }

  loadParams(){
    /**
     * No realizar la suscripcion en el template (cambia el Lifecycle)! 
     * Puede generar errores "ExpressionChanged"
     */
    this.loadParams$ = this.route.queryParams.pipe(
      map(
        queryParams => { 
          var params = this.initParams(queryParams);
          this.initDisplay(params)
        },
        error => { 
          this.dialog.open(DialogAlertComponent, {
            data: {title: "Error", message:error.error}
          });
        }
      ), 
      map(
        () => {return true;}
      )
    )
  }

  loadDisplay(){
    /**
     * Se define como observable y se suscribe en el template
     * con esto me aseguro de que me suscribo luego de inicializados los parametros
     * Si me suscribo directamente en el template, se suscribe dos veces, uno en null y otro con el valor del parametro
     */
    this.loadDisplay$ =  this.display$.pipe(
      switchMap(
        () => {
          return this.initData();
        }
      ),
      map(
        data => {
          this.data = data;
          return true;
        }
      )
    )
  }

  initParams(params: any){ return params; }

  initDisplay(params){ this.display$.next(params);  }

  initData(): Observable<any> {
    return of({}).pipe(
      switchMap(() => {
        if(isEmptyObject(this.display$.value)) return of (null);
        else return this.dd.unique(this.entityName, this.display$.value)
      }),
      map(
        data => {
          if(!isEmptyObject(data)) return data;
          return fastClone(this.display$.value)
          /**
           * Se retorna un clone para posibilitar el cambio y el uso de ngOnChanges si se requiere
           */
        }
      )
    );
  }

  back() { this.location.back(); }

  delete() { 
    this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message:"No implementado"}
    });
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }
}