import { OnInit, AfterViewInit, Component } from '@angular/core';
import { AdminRelStructure } from '@class/admin-rel-structure';
import { Display } from '@class/display';
import { AdminComponent } from '@component/admin/admin.component';
import { isEmptyObject } from '@function/is-empty-object.function';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { combineAll, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'core-admin-rel',
  template: '',
})
export abstract class AdminRelComponent extends AdminComponent implements OnInit, AfterViewInit { //2
/**
 * Especializacion del formulario de administracion 
 * para administrar una entidad y sus relaciones
 */

  structure:AdminRelStructure[];
  persistApi:string = "persist_rel";
  queryApi:string = "unique_rel"
  /**
   * 'unique_rel' permite inicializar en el servidor una entidad y sus relaciones haciendo un cuidadoso analisis de los parametros
   * "unique_rel_um" utiliza unique_rel y lo combina con metodos para inicializar las relaciones um.
   * Ejemplo de identificacion de relaciones um, sea la entidad principal toma: 
   *   cur: curso (toma.curso) fk
   *   cur_com: comision (curso.comision) fk
   *   cur_com-alumno/comision (alumno.comision) um
   * @returns 
   */

  serverData() { return this.adminForm.value }

  queryData(): Observable<any> {
    switch(this.queryApi){
      case "unique_rel_um": return this.dd.post("unique_rel", this.entityName, this.display$.value).pipe(
        switchMap(
          data => {
            var obs = {}
            for(var i = 0; i < this.structure.length; i++){
              var key = this.structure[i].id; 

              if(key.includes("/")){
                if( (key.includes("-"))){
                  var prefix = key.substr(0, key.indexOf('-'));
                  var l = key.indexOf('-')+1
                  var entityName = key.substr(l, key.indexOf('/')-l);
                } else {
                  var prefix =  this.entityName;
                  var entityName = key.substr(0,key.indexOf('/'));
                }

                var fkName = key.substr(key.indexOf('/')+1);
                obs[key] = this.queryDataUm(data,key,entityName,fkName,prefix)
              }
            }

            return (!isEmptyObject(obs)) ? this.combineDataUm(data, obs) : of(data) 
          }
        )
      )
      default: return super.queryData();
    }
  }

  queryDataUm(
    data: { [x: string]: { [x: string]: string | number; }; }, 
    key: string | number, 
    entityName: string, 
    fkName: string | number, 
    prefix: string | number
  ){
    if(!data[prefix]["id"]) return of([]);
    var display = new Display();
    display.setCondition([fkName,"=",data[prefix]["id"]])
    return this.dd.all(entityName, display)  
  }

  combineDataUm(data, obs){
    return forkJoin(obs).pipe(
      map(
        response => {
          for(var i in response){
            if(response.hasOwnProperty(i)) data[i] = response[i]
          }
          return data;
        }
      )
    )
  }

  loadStorage() {
    /**
     * Se incluye una comparacion adicional para inicializar correctamente.
     * Al utilizar *ngIf y asignar varios controls al adminForm no se inicializa correctamente
     * En el caso de que la cantidad de elementos de la estructura no sea igual a la cantidad de controls del formulario 
     * no se inicializa el storage, pero permite utilizar el formulario
     */
    var s = this.adminForm.valueChanges.subscribe (
      formValues => {
        if(Object.keys(this.adminForm.controls).length == this.structure.length)
          this.storage.setItem(this.router.url, formValues);
      },
      error => { 
        this.snackBar.open(JSON.stringify(error), "X"); 
      }
    );
    this.subscriptions.add(s);
  }
}
