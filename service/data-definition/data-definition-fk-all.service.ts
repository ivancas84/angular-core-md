import { Injectable } from '@angular/core';
import { FormConfig } from '@class/reactive-form-config';
import { isEmptyObject } from '@function/is-empty-object.function';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataDefinitionRelInitialize } from './data-definition-rel-initialize.service';
import { DataDefinitionToolService } from './data-definition-tool.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionFkAllService {
  /**
   * Servicio de inicializacion de un conjunto de campos de una entidad y sus relaciones
   * Los metodos de este servicio retornan un array de resultados de la forma
   *   [{id:"value", activo:true, per-id:"value", per-numero_documento:"value"},...]
   */

  constructor(
    protected dd: DataDefinitionToolService, 
    protected init: DataDefinitionRelInitialize
  ) { }

  public getAllFields(entityName: string, ids: string[], fields: string[]): Observable<any> {
    /**
     * @param entityName Nombre de la entidad
     * @param ids ids de entityName
     * @param fields Campos de entityName y sus relaciones obtenidos de configuracion,
     *   las relaciones se definen con "prefix-"
     *   Ejemplo de fields (per-numero_documento)
     *
     * @return Ejemplo de retorno (para la entidad principal alumno)
     *   [{id:"value", activo:true, per-id:"value", per-numero_documento:"value"},...]
     * 
     * @summary
     * Se efectuan tres acciones principales:
     *   1) Inicializar los campos de una entidad y sus relaciones
     *      No se inicializan todas las relaciones, 
     *      solo las que se determinan en el parametor "fields"
     *   2) Obtener los datos de entityName en base a ids
     *   3) Obtener el mapa de las relaciones ("rel")
     * 
     *   4) Recorre el arbol de relaciones
     *   5) Para cada relacion obtiene los fields de la correspondiente entidad
     *   6) Define un elemento formado por: 
     *      a) campos de la entidad de la relacion recorrida, 
     *      b) nombre entidad recorrida y 
     *      c) prefijo de clave foranea
     *   7) Invoca a metodo recursivo chaining para recorrer el conjunto de elementos definido 
     * 
     *
     * @description
     * A diferencia de las consultas retornadas del servidor, 
     * se utiliza el caracter - (guion medio) como separador 
     * para facilitar posteriormente la identificacion de fields 
     * y la aplicacion de ciertas caracteristicas como por ejemplo ordenamiento
     * 
     * @description 2
     * Para definir el prefijo de la clave foranea verifica la existencia del caracter _
     * Si existe _ significa que se esta recorriendo una fk indirecta, 
     * por lo tanto debe inlcuirse el correspondiente prefijo en la clave foranea 
     * Ejemplo per_dom, se define como per-domicilio
     * 
     * Si no existe _ significa que se esta recorriendo una fk directa,
     * Ejemplo per, se define como persona  
     */
    return combineLatest([
      this.init.initializeRelationsFields(entityName, fields),
      this.dd.getAll(entityName, ids)
    ]).pipe(
      switchMap(
        response => {
          var fieldsInitialized = response[0];
          var data = response[1];
          return this.dd.post("rel",entityName).pipe(
            switchMap(
              rel => {
                var keys =  Object.keys(rel);
                var elements = []
                for(var j = 0; j < keys.length; j++) {
                  if(rel.hasOwnProperty(keys[j])) {
                    var fields = this.init.filterFields(fieldsInitialized, keys[j]+"-");
                    if(!isEmptyObject(fields)) {
                      var e = {
                        "fields":fields,
                        "entityName":rel[keys[j]]["entity_name"],  
                        "fkName":((keys[j].includes("_")) ? keys[j].substr(0, keys[j].lastIndexOf('_'))+"-" : "") + rel[keys[j]]["field_name"]
                      };
                      elements.push(e);
                    }
                  }
                }
                return this.chaining(data,elements, 0)
              }
            )
          )
        }
      )
    )
  }
    
  public getAllConfig(
    entityName: string, //entidad principal
    ids: string[], //ids de entityName
    controls:{ [index: string]: FormConfig } //objeto de configuracion
  ){
    /**
     * @summary
     * Analiza el parametro de configuracion controls para identificar los campos existentes.
     * Se utiliza el caracter "-" para identificar las relaciones um.
     * Si existen campos um ejecuta this.getAll (inicializa relaciones) 
     * sino this.dd.getAll (no hace falta inicializar relaciones) 
     * 
     * A diferencia de las consultas retornadas del servidor, 
     * se utiliza en las respuestas el caracter "-" (guion medio) como separador, 
     * para facilitar posteriormente la identificacion de fields 
     * y la aplicacion de ciertas caracteristicas como por ejemplo ordenamiento
     *
     * @example Ejemplo de retorno (para la entidad principal alumno)
     *   [{id:"value", activo:true, per-id:"value", per-numero_documento:"value"},...]
     * 
     */
    var fields = [];

    Object.keys(controls).forEach(key => {
      if(key.includes("-")) fields.push(key);
    });
     return (!fields.length) ? 
       this.dd.getAll(entityName, ids) : 
       this.getAllFields(entityName, ids, fields);
  }

  protected chaining(
    data: { [index: string]: any; }[], //conjunto de datos 
    elements: string | any[], //conjunto de elementos formado por fields: string de campos, entityName: nombre de la entidad, fkName: nombre de la fk (con prefijo)
    i: number //indice recorrido
  ){
    /**
     * @summary
     * Recorrer datos en base a una serie de elementos y encadenar observables
     */
    if(i == elements.length) return of(data);
    /**
     * si el indice es igual a la cantidad de elementos, ya no queda nada por recorrer, 
     * se retornan los datos y se finaliza con la recursion
     */ 
    return this.dd.getAllConnection(data, elements[i]["fkName"], elements[i]["entityName"], elements[i]["fields"]).pipe(
      switchMap(
        response => this.chaining(response, elements, ++i)
      )
    )
  }

}
