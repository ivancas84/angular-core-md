import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { isEmptyObject } from '../../function/is-empty-object.function';
import { OnInit,  Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fastClone } from '@function/fast-clone';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { Display } from '@class/display';

@Component({
  selector: 'core-detail',
  template: '',
})
export abstract class DetailComponent implements OnInit {
/**
 * Detalle
 */

  readonly entityName: string; //entidad principal
  params:any; //parametros de vista
  display:Display; //parametros de consulta
  data: any; //datos principales

  load$: Observable<any>; //carga de parametros
  load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga
  protected subscriptions = new Subscription(); //suscripciones en el ts

  constructor(
    protected route: ActivatedRoute, 
    protected location: Location, 
    protected dd: DataDefinitionService, 
    protected dialog: MatDialog,
  ) {}
  
  
  ngOnInit() {
    this.load$ = this.route.queryParams.pipe(
      tap(
        queryParams => { 
          this.load = false; 
          this.initParams(queryParams);
          this.initDisplay()
        }
      ),
      switchMap(
        () => this.initData()
      ), 
      map(
        () => { return this.load = true;}
      )
    )
  }

  initDisplay() {
    this.display = this.params;
  }

  initParams(params: any){ this.params = params; }

  initData(): Observable<any> {
    return of({}).pipe(
      switchMap(() => {
        if(isEmptyObject(this.display)) return of (null);
        else return this.dd.unique(this.entityName, this.display)
      }),
      map(
        data => {
          this.data = (!isEmptyObject(data)) ? data : fastClone(this.display)
          return this.data
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