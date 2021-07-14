import { Injectable } from '@angular/core';
import { AdminRelStructure } from '@class/admin-rel-structure';
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
   * Servicio de inicializacion de una entidad y sus relaciones fk
   * El metodo principal "uniqueStructure" recibe
   *   1) el nombre de una entidad 
   *   2) un conjunto de parametros de inicializacion 
   *   3) una estructura de administracion
   * Se obtiene una tupla de 1 utilizando 2, luego se obtienen las relaciones utilizando 3
   * El resultado es un objeto con keys (nombre de la relacion) y values (valor correspondiente)
   * Ej. para la entidad "alumno" {
   *   "alumno" => {id:"1", activo:true, ...}
   *   "per" => {id:"1", nombres:"Juan"}
   *   "per_dom" => {id:"1", calle:"33"}
   * }  
   */

  constructor(
    protected dd: DataDefinitionToolService, 
  ) { }

  public uniqueStructure(entityName:string, params:any, structure:AdminRelStructure[]){
    return this.dd.unique(entityName, params).pipe(
      switchMap(
        (row) => {
          if(!row) return this.initStructure(entityName, params, structure);
          var r = {};
          r[entityName] = fastClone(row)
          /**
           * @todo se cargan todos los campos, deberian filtrarse solo los de la entidad
           */
          return this.structure(entityName, r, structure)
        }
      )
    )
  }

  public initStructure(entityName:string, params:any, structure:AdminRelStructure[]){
    /**
     * Recorre parametros e inicializa relaciones
     */
    if(!params) return of(null);
    var r = {};
    r[entityName] = fastClone(params)
    /**
     * @todo se cargan todos los campos, deberian filtrarse solo los de la entidad
     */
    return this.structure(entityName, r, structure)
  }

  public structure(entityName:string, row: any, structure: AdminRelStructure[]){
    /**
     * Definir relaciones a partir de la estructura y armar el arbol de datos
     */
    var relationsFk = [];
    for(var i = 0; i < structure.length; i++){
      /**
       * Recorrer estructura para identificar relaciones fk
       */
      var key = structure[i].id; 
      if(!key.includes("/")) relationsFk.push(key)
    }

    return this.fk(entityName, row, relationsFk)
  }

  protected fk(entityName:string, row, relationsFk:string[]){
    /**
     * @param entityName Nombre de la entidad
     * @param row Tupla de entityName
     * @param relationsFk Relaciones de entityName
     * 
     * Recorrer las relaciones fk indicadas en relationsFk
     * para definir los valores de las relaciones,
     * se asignan a row
     */
    if(!relationsFk.length) return of(row); 
    return combineLatest([
      this.initializeRelations(entityName, relationsFk),
      this.dd.post("tree", entityName)
    ]).pipe(
      mergeMap(
        response => this.fkTree(entityName, row, response[1], response[0])
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

  protected recursive(id, row, key, tree, relationsFk){
    /**
     * @param row Datos correspondientes a la entidad origen (la entidad que posee a key como clave foranea)
     * @param key Llave del tree que debe procesarse
     * @param tree Arbol de relaciones
     * @param relationsFk Relaciones que deben procesarse
     */
     return of({}).pipe(
      switchMap(() => {
        if(row[id].hasOwnProperty(tree[key]["field_name"]) && row[id][tree[key]["field_name"]])  return this.dd.get(tree[key]["entity_name"], row[id][tree[key]["field_name"]])
        else return of(null);
      }),
      map(
        response => {
          row[key] = response
          return row
        }
      ),
      switchMap(
        row => {
          if(!isEmptyObject(tree[key]["children"])){
            return this.fkTree(key, row, tree[key]["children"], relationsFk)
          } else {
            return of(row)
          }
        }
      )
    )
  }

  protected fkTree(id, row, tree, relationsFk) {
    /**
     * @param id Identificador de row que debe ser tenido en cuenta para obtener los datos
     * @param row Datos
     * @param tree Arbol de relaciones
     * @param relationsFk Relaciones que deben inicializarse
     */
    var obs;
    for(var key in tree){
      if(relationsFk.includes(key)){
        if(!obs) obs = this.recursive(id, row, key, tree, relationsFk);
        else obs.pipe(
          switchMap(
            row => {
              return this.recursive(id, row, key, tree, relationsFk)
            }
          )
        )
      }
    }
    return (obs) ? obs : of(row);
  }

}
