import { Injectable } from '@angular/core';
import { Display } from '@class/display';
import { FormArrayConfig, FormConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataDefinitionFkAllService } from './data-definition-fk-all.service';
import { DataDefinitionToolService } from './data-definition-tool.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionUmObjService {
  /**
   * @todo renombrar a DataDefinitionUmService
   * Servicio de inicializacion de una entidad y sus relaciones um
   * El metodo principal "data" (actualmente llamado "group") recibe
   *   1) el nombre de una entidad 
   *   2) un conjunto de datos de inicializacion (tupla de entityName)
   *   3) un array de configuracion
   * Se recorre la estructura para identificar las relaciones um.
   * Si existen relaciones um se realiza una consulta a la base de datos y se asocia al conjunto de datos de inicializacion
   * Ej. para la entidad "alumno" {
   *   "alumno" => {id:"1", activo:true, ...}
   *   "per-detalle_persona/persona => {id:"1", archivo:"..."}
   *   "calificacion/alumno" => {id:"1", nota:"10"}
   * }  
   */

  constructor(
    protected dd: DataDefinitionToolService, 
    protected rel: DataDefinitionFkAllService
  ) { }

  public uniqueGroup(entityName:string, params:any, controls:{ [index: string]: FormConfig }){
    /**
     * @todo renombrar a unique
     * Realiza una llamada a unique anets de invocar a data
     */
    return this.dd.unique(entityName, params).pipe(
      switchMap(
        (row) => {
          if(!row) return of(null);
          var r: {[index:string]:string} = {};
          r[entityName] = fastClone(row)
          /**
           * @todo se cargan todos los campos, deberian filtrarse solo los de la entidad
           */
          return this.group(entityName, r, controls)
        }
      )
    )
  }


  public group(entityName:string, row: any, controls:{ [index: string]: FormConfig }){
    /**
     * @todo group confunde, renombrar a "data"
     * 
     * @summary 
     * 1) Recorrer array de configuracion (controls)
     * 2) Para cada rel um, invocar a queryDataUm, almacenar el resultado en un array de observables
     * 3) combinar los resultados del paso 2 en la consulta original (mediante this.combineDataUm)
     * 
     * @description
     * Para saber si es un relacion um, actualmente se verifica la existencia del caracter "/"
     */
    var obs: {[index:string]:any} = {}
    
    Object.keys(controls).forEach(key => {
      if(key.includes("/")){
        if( (key.includes("-"))){
          var prefix = key.substr(0, key.indexOf('-'));
          var l = key.indexOf('-')+1
          var en = key.substr(l, key.indexOf('/')-l);
        } else {
          var prefix = entityName;
          var en = key.substr(0,key.indexOf('/'));
        }

        var fkName = key.substr(key.indexOf('/')+1);
        obs[key] = this.queryDataUm(row,en,fkName,prefix,controls[key] as FormArrayConfig)
      }
    });

    return (!isEmptyObject(obs)) ? 
      this.combineDataUm(row, obs) : 
      of(row) 
  }


  protected queryDataUm(
    data: { [x: string]: { [x: string]: string | number; }; }, 
    entityName: string, 
    fkName: string, 
    prefix: string,
    formArray: FormArrayConfig,
  ){

    if(!data[prefix]["id"]) return of([]);
    var display = new Display();
    display.setCondition([fkName,"=",data[prefix]["id"]])
    if(formArray.order) display.setOrder(formArray.order);
    return this.dd.post("ids",entityName, display).pipe(
      switchMap(
        ids => this.rel.getAllConfig(entityName, ids, formArray.controls)
      ),

    )  
  }

  protected combineDataUm(data: { [x: string]: any; }, obs: { [index: string]: any; }){
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
}
