import { OnInit, AfterViewInit, Component, Output, EventEmitter } from '@angular/core';
import { AdminRelStructure } from '@class/admin-rel-structure';
import { Display } from '@class/display';
import { FieldViewOptions } from '@class/field-view-options';
import { AdminComponent } from '@component/admin/admin.component';
import { isEmptyObject } from '@function/is-empty-object.function';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { combineAll, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'core-admin-rel-dynamic',
  template: '',
})
export abstract class AdminRelDynamicComponent extends AdminComponent implements OnInit, AfterViewInit { //3
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

   optColumn: any[] = null; //opciones (si es null no se visualiza)

  serverData() { return this.adminForm.value }

  queryData(): Observable<any> {
    switch(this.queryApi){
      case "unique_rel_um": return this.dd.post("unique_rel", this.entityName, this.display$.value).pipe(
        switchMap(
          data => {
            var obs = {}
            for(var i = 0; i < this.structure.length; i++){
              /**
               * Recorrer estructura para procesar relaciones um
               */
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
                obs[key] = this.queryDataUm(data,entityName,fkName,prefix,i)
              }
            }

            return (!isEmptyObject(obs)) ? 
              this.combineDataUm(data, obs) : 
              of(data) 
          }
        )
      )
      default: return super.queryData();
    }
  }

  queryDataUm(
    data: { [x: string]: { [x: string]: string | number; }; }, 
    entityName: string, 
    fkName: string, 
    prefix: string,
    index: number 
  ){
    console.log("voy a consultar" +entityName+fkName+prefix+index+data[prefix]["id"] )
    if(!data[prefix]["id"]) return of([]);
    var display = new Display();
    display.setCondition([fkName,"=",data[prefix]["id"]])
    console.log(display);
    if(this.structure[index].order) display.setOrder(this.structure[index].order);
    return this.dd.post("ids",entityName, display).pipe(
      switchMap(
        ids => this.dd.relGetAllFvo(entityName, ids, this.structure[index].fieldsViewOptions)
      ),

    )  
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

  @Output() event: EventEmitter<any> = new EventEmitter();

  switchAction($event:any){ 
    console.log($event)

    /**
     * Acciones de opciones
     * Sobescribir si se necesita utilizar eventos
     * Utilizar $event.action para la accion a ejecutar (corresponde a opt.action)
     * Utilizar $event.data para los datos a utilizar (corresponde a row)
     */  
    switch($event.action){
      case "delete":
        this.delete()
      break;
      default:
        throw new Error("Not Implemented");
    }   
  }

  emitEvent($event){
    console.log($event);
    switch($event.action){
      default:
        this.event.emit($event);
    }
  }
}
