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
  length: number; //longitud total de los datos a mostrar
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
          this.params = queryParams;
          this.initDisplay();          
        }
      ),
      switchMap(
        () => this.initInfo()
      ),
      map(
        ()=> {return this.load = true}
      )
    );
  }

  initDisplay() {
    this.display = new Display();
    this.display.setSize(100);
    this.display.setParamsByQueryParams(this.params);
  }

  initInfo(): Observable<any>{
    /**
     * Se define un metodo independiente para definir la cantidad total y los datos a mostrar
     * La definición de la cantidad y el total se realizan conjuntamente para facilitar la reimplementacion
     * en ocasiones la cantidad depende de los datos, 
     * en ocasiones para definir los datos se tiene en cuenta la cantidad (sin cantidad los datos seran nulos)
     */
    return this.initLength().pipe(
      switchMap(
        count => {
          this.length = count;
          return this.initData()
        }
      ),
      tap(
        data => {
          this.data = data;
        }
      )
    )
  } 

  initLength(): Observable<any> {
    return this.dd.post("count", this.entityName, this.display);
  }

  initData(): Observable<any>{
    if(!this.length) return of([]); 
    return this.dd.all(this.entityName, this.display);
  }

}
