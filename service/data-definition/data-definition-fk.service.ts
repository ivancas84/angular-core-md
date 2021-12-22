import { Injectable } from '@angular/core';
import { isEmptyObject } from '@function/is-empty-object.function';
import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataDefinitionRelInitialize } from './data-definition-rel-initialize.service';
import { DataDefinitionToolService } from './data-definition-tool.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionFkService {
  /**
   * Servicio de inicializacion de campos de una entidad y sus relaciones
   * Los metodos de este servicio retornan un array de resultados de la forma
   *   [{id:"value", activo:true, per-id:"value", per-numero_documento:"value"},...]
   */

  constructor(
    protected dd: DataDefinitionToolService, 
    protected init: DataDefinitionRelInitialize
  ) { }

  public get(entityName: string, id: string, fields: string[]): Observable<any> {
    /**
     * @param entityName Nombre de la entidad
     * @param id Identificador de entityName
     * @param fields Campos de entityName y sus relaciones, las relaciones se definen con "prefix-"
     *    Ejemplo de fields (per-numero_documento)
     *
     * @return Ejemplo de retorno (para la entidad principal alumno)
     *   {id:"value", activo:true, per-id:"value", per-numero_documento:"value"}
     * 
     * Inicializar los campos de una entidad y sus relaciones
     * No se inicializan todas las relaciones, solo las que se determinan en "fields"
     * A diferencia de las consultas retornadas del servidor, se utiliza el caracter - (guion medio) como separador, 
     * para facilitar posteriormente la identificacion de fields y la aplicacion de ciertas caracteristicas como por ejemplo ordenamiento
     */
    return combineLatest([
      this.init.initializeRelationsFields(entityName, fields),
      this.dd.get(entityName, id)
    ]).pipe(
      switchMap(
        response => {
          var fieldsInitialized = response[0];
          var data = response[1];
          
          return this.dd.post("rel",entityName).pipe(
            switchMap(
              rel => {
                var obs: Observable<{ [index: string]: any; }>;
                var keys =  Object.keys(rel);
                for(var i = 0; i < keys.length; i++){
                  try{throw i} catch(j){
                    if(rel.hasOwnProperty(keys[j])){
                      if(!isEmptyObject(this.init.filterFields(fieldsInitialized, keys[j]+"-"))) {
                        if(!obs){
                          // data: { [index: string]: any }, 
                          // fkName: string, 
                          // entityName: string, 
                          // fieldsInitialized: { [index: string]: any },
                          // join:string=", "
                        
                          obs = this.dd.getConnection(
                            data, 
                            ((keys[j].includes("_")) ? keys[j].substr(0, keys[j].lastIndexOf('_'))+"-" : "") + rel[keys[j]]["field_name"],
                            rel[keys[j]]["entity_name"], 
                            this.init.filterFields(fieldsInitialized, keys[j]+"-")
                          )
                        } else {
                          obs = obs.pipe(
                            switchMap(
                              (d:any) => {
                                return this.dd.getConnection(d, 
                                  ((keys[j].includes("_")) ? keys[j].substr(0, keys[j].lastIndexOf('_'))+"-" : "") + rel[keys[j]]["field_name"],
                                  rel[keys[j]]["entity_name"], 
                                  this.init.filterFields(fieldsInitialized, keys[j]+"-"))}
                            ),
                        
                          )
                        }
                      }
                    }
                  }
                }
                return obs
              }
            )
          )
          
        }
      )
    )
  }


}
