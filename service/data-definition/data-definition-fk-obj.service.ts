import { Injectable } from '@angular/core';
import { FormConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { DataDefinitionToolService } from './data-definition-tool.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionFkObjService {
  /**
   * @summary
   * Servicio de inicializacion de una entidad y sus relaciones fk 
   * Los metodos de este servicio retornan un objeto de resultados de la forma
   * {
   *   "alumno" => {id:"1", activo:true, ...}
   *   "per" => {id:"1", nombres:"Juan"}
   *   "per_dom" => {id:"1", calle:"33"}
   * }
   */

  constructor(
    protected dd: DataDefinitionToolService, 
  ) { }

  public uniqueConfig(entityName:string, params:any, controls:{ [index: string]: FormConfig }){
    /**
     * @summary
     * 1) Realiza una consulta "unique" a partir de los "params"
     * 2) Invoca al metodo principal "data"
     * 
     * @example Ejemplo de conjunto de datos de retorno (data)
     * {
     *   "alumno" => {"id":"value",...}
     *   "per" => {"id":"value",...}
     *   "per_dom" => {"id":"value",...}
     * }
     */

    if(!params) return of(null);
    return this.dd.unique(entityName, params).pipe(
      switchMap(
        (row) => {
          var data: {[key: string]: any } = {};
          data[entityName] = (!row) ?  fastClone(params) : fastClone(row)
          /**
           * @todo se cargan todos los campos, deberian filtrarse solo los de la entidad
           */
          return this.dataConfig(entityName, data, controls)
        }
      )
    )
  }

  public dataConfig(entityName:string, data: any, controls: { [index: string]: FormConfig }){
    /**
     * @summary
     * 1) Recorrer el array de configuracion (controls) y obtener los campos de relacion
     * 2) Recorrer las relaciones fk indicadas en relationsFk
     * 3) Inicializar las relaciones faltantes (initializeRelations)
     * 4) Definir arbol de relaciones (tree)
     * 5) Definir los datos de las relaciones fk a partir del arbol (chaining)
     * 
     * @example Ejemplo de conjunto de datos de retorno
     * {
     *   "alumno" => {"id":"value",...}
     *   "per" => {"id":"value",...}
     *   "per_dom" => {"id":"value",...}
     * }
     * 
     * @description
     * Este metodo trabaja con el arbol de relaciones tree y rel para definir y asociar datos
     * No puede ser utilizado para relaciones derivadas
     */
    var relationsFk: string[] = [];
    Object.keys(controls).forEach(key => {
      if(!key.includes("/") && entityName != key)  relationsFk.push(key)
    });
    if(!relationsFk.length) return of(data); 
    return combineLatest([
      this.initializeRelations(entityName, relationsFk),
      this.dd.post("tree", entityName)
    ]).pipe(
      mergeMap(
        response => this.chaining(entityName, data, response[1], response[0], 0)
      )
    )
  }

  protected initializeRelations(entityName: string, relationsFk: string[]): Observable<any> {
    /**
     * Para realizar correctamente las relaciones entre las distintas entidades
     * es necesario que existan ciertos campos de relacion que pueden no estar incluidos en el parametro original
     * Se recorre el parametro relationsFk e inicializan las relaciones faltantes
     * por ejemplo, si desde alumno queremos recorrer domicilio (per_dom), debemos pasar por persona (per), 
     * debe existir "per" por mas que no se incluya
     */
    return this.dd.post("rel",entityName).pipe( //se consultan las relaciones de la entidad para armar el grupo de fields
      map(
        rel => {
          var r = fastClone(relationsFk)
          for(var i = 0; i < relationsFk.length; i++){ //se recorren los fields a consultar para identificar las relaciones faltantes
              if(relationsFk[i].includes("-")) {
                var k = relationsFk[i].substr(0, relationsFk[i].indexOf('-'));
                if(k.includes("_")) {
                  var s = k.substr(0, k.lastIndexOf('_'));
                  if(r.indexOf(s) === -1) r.push(s)
                }
              }
          }
          return r
        }
      )
    )
  }

  protected recursive(
    entityKey: string | number, //identificador de la entidad (prefijo o entidad principal)
    data: { [x: string]: any; }, //conjunto de datos (se procesara data[entityKey])
    key: string,  //Llave del tree que debe procesarse
    tree: { [x: string]: { [x: string]: any; }; }, //arbol de relaciones
    relationsFk: any //string con el nombre de las relaciones
  ): any{
    /**
     * @summary
     * 1) Si existe data[entityKey][tree[key]["field_name"]] retorna this.dd.get(tree[key]["entity_name"], data[entityKey][tree[key]["field_name"]]) 
     * 2) Aplica recursion invocando a chaining utilizando los mismos parametros pero con tree = tree["children"]
     * 
     * @description
     * Se utiliza conjuntamente con chaining para aplicar recursion a los subarboles
     */
     return of({}).pipe(
      switchMap(() => {
        if(data[entityKey].hasOwnProperty(tree[key]["field_name"]) && data[entityKey][tree[key]["field_name"]])  return this.dd.get(tree[key]["entity_name"], data[entityKey][tree[key]["field_name"]])
        else return of(null);
      }),
      map(
        response => {
          data[key] = response
          return data
        }
      ),
      switchMap(
        data => {
          if(!isEmptyObject(tree[key]["children"])){
            return this.chaining(key, data, tree[key]["children"], relationsFk, 0)
          } else {
            return of(data)
          }
        }
      )
    )
  }
  
  protected chaining(
    entityKey: string, //nombre de la entidad a procesar
    data: { [x: string]: any; }, //conjunto de datos (se procesara data[entityKey])
    tree: { [x: string]: { [x: string]: any; }; }, //arbol de relaciones 
    relationsFk: string | string[], //string con las relaciones a procesar
    i: number //indice de keys que se esta procesando 
  ): any{
    /**
     * @summary
     * 1) Recorre uno a uno los keys de tree para definir los datos 
     * de las relaciones y asociarlos al conjunto de datos principal
     * 2) Invoca a recursive para consultar datos y aplicar chaining a cada subarbol: tree[keys[i]]
     * 
     * @description
     * Se utiliza conjuntamente con metodo recursivo para consultar los datos e invocar nuevamente a chaining con tree["children"]
     */
    var keys = Object.keys(tree);
    if(i == keys.length) return of(data);
    else return of({}).pipe(
      switchMap(
        () => {
          if(!relationsFk.includes(keys[i])) return of(data);
          return this.recursive(entityKey, data, keys[i], tree, relationsFk)
          /**
           * Consultar datos de data[entityKey] e invocar a chaining para tree[keys[i]]["children"]
           */
        } 
      ),
      switchMap(
        (data: any) => this.chaining(entityKey, data, tree, relationsFk, ++i) 
        /**
         * Continuar con el siguiente valor de tree
         */
      )
    )
  }


}
