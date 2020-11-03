import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Display } from '@class/display';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Component({
  selector: 'core-show',
  template: '',
})
export abstract class ShowComponent implements OnInit {

  readonly entityName: string; //Nombre de la entidad principal
  data: any; //datos principales
  length: number = null; //longitud total de los datos a mostrar
  display: Display; //Parametros de visualizacion
  params: { [x: string]: any; } //Parametros del componente
  load$: Observable<any>; //Disparador de observables
  load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga

  constructor(
    protected dd: DataDefinitionService, 
    protected route: ActivatedRoute, 
  ) {}

  ngOnInit(): void {
    this.load$ = this.route.queryParams.pipe(
      tap(
        queryParams => {
          this.load = false;
          var params = this.initParams(queryParams);
          this.initDisplay(params);          
        }
      ),
      switchMap(
        () => this.initLength()
      ),
      switchMap(
        () => this.initData()
      ),
      map(
        ()=> {return this.load = true}
      )
    );
  }

  initParams(params: any){ return params; }

  initDisplay(params) {
    this.display = new Display();
    this.display.setSize(100);
    this.display.setParamsByQueryParams(params);
  }

  initLength(): Observable<any> {
    /**
     * Si no se desea procesar la longitud, retornar valor false return of(false)
     */
    return this.dd.post("count", this.entityName, this.display).pipe(
      tap(
        count => { this.length = count; }
      )
    );
  }

  initData(): Observable<any>{
    return of({}).pipe(
      switchMap(
        () => {
          if(!this.length && this.length !== null) return of([]); 
          return this.dd.all(this.entityName, this.display);
        }
      ),
      tap(
        data => {
          this.data = data;
        }
      )
    )

  }

}
