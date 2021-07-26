import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Display } from '@class/display';
import { FormArrayExt, FormGroupExt } from '@class/reactive-form-ext';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataDefinitionRelFieldsService } from './data-definition-rel-fields.service';
import { DataDefinitionToolService } from './data-definition-tool.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionUmObjService {
  /**
   * Servicio de inicializacion de una entidad y sus relaciones um
   * El metodo principal "structure" recibe
   *   1) el nombre de una entidad 
   *   2) un conjunto de datos de inicializacion (tupla de entityName)
   *   3) una estructura de administracion
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
    protected rel: DataDefinitionRelFieldsService
  ) { }

  public uniqueGroup(entityName:string, params:any, group:FormGroupExt){
    return this.dd.unique(entityName, params).pipe(
      switchMap(
        (row) => {
          if(!row) return of(null);
          var r = {};
          r[entityName] = fastClone(row)
          /**
           * @todo se cargan todos los campos, deberian filtrarse solo los de la entidad
           */
          return this.group(entityName, r, group)
        }
      )
    )
  }


  public group(entityName:string, row: any, group: FormGroup){
    var obs = {}
    
    Object.keys(group.controls).forEach(key => {
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
        obs[key] = this.queryDataUm(row,en,fkName,prefix,group.controls[key] as FormArrayExt)
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
    formArray: FormArrayExt,
  ){
    if(!data[prefix]["id"]) return of([]);
    var display = new Display();
    display.setCondition([fkName,"=",data[prefix]["id"]])
    if(formArray.order) display.setOrder(formArray.order);
    return this.dd.post("ids",entityName, display).pipe(
      switchMap(
        ids => this.rel.getAllGroup(entityName, ids, formArray.factory.formGroup())
      ),

    )  
  }

  protected combineDataUm(data, obs){
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
