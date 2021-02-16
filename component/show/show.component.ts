import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Display } from '@class/display';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';

@Component({
  selector: 'core-show',
  template: '',
})
export abstract class ShowComponent implements OnInit {

  readonly entityName: string; //Nombre de la entidad principal
  data: any; //datos principales
  length: number = null; //longitud total de los datos a mostrar
  display: Display; //parametros de visualizacion
  params: { [x: string]: any; } //Parametros del componente
  load$: Observable<any>; //Disparador de observables
  load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga

  constructor(
    protected dd: DataDefinitionService, 
    protected route: ActivatedRoute, 
    protected dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.load$ = this.route.queryParams.pipe(
      tap(
        queryParams => {
          this.load = false;
          this.params = this.initParams(queryParams);
          this.initDisplay();          
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

  initDisplay() {
    this.display = new Display();
    this.display.setSize(100);
    this.display.setParamsByQueryParams(this.params);
  }

  initLength(): Observable<any> {
    /**
     * Si no se desea procesar la longitud, retornar valor false return of(false)
     */
    return this.dd.post("count", this.entityName, this.display).pipe(
      catchError(
        (error) => {
          this.dialog.open(DialogAlertComponent, {
            data: {title: "Error", message: error.error}
          })
         return of(null);
        }
      ),    
      tap(
        count => { this.length = count; }
      )
    );
  }

  initData(): Observable<any>{
    /**
     * Dependiendo de las caracteristicas de la interfaz,
     * puede sobrescribirse omitiendo el uso de display,
     * y directamente utilizar params.
     * Si se utiliza search considerar que tambien esta configurado con display.
     */
    return of({}).pipe(
      switchMap(
        () => {
          if(!this.length && this.length !== null) return of([]); 
          return this.queryData();
        },
      ),
      tap(
        data => {
          this.data = data;
        }
      ),      
    )
  }

  queryData(): Observable<any>{
    return this.dd.all(this.entityName, this.display);
  }

}
