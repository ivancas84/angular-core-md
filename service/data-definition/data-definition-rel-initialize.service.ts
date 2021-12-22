import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormConfig, FormControlConfig, FormGroupConfig } from '@class/reactive-form-config';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { DataDefinitionToolService } from './data-definition-tool.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionRelInitialize {
  /**
   * @summary
   * Servicio con metodos inicializacion
   **/

  constructor(
    protected dd: DataDefinitionToolService, 
  ) { }

  public initializeRelationsPrefix(entityName: string, relationsFk: string[]): Observable<any> {
    /**
     * @summary
     * Para realizar correctamente las relaciones entre las distintas entidades
     * es necesario que existan ciertos campos de relacion que pueden no estar incluidos en el parametro original
     * Se recorre el parametro relationsFk e inicializan las relaciones faltantes
     * por ejemplo, si desde alumno queremos recorrer domicilio (per_dom), debemos pasar por persona (per), 
     * debe existir "per" por mas que no se incluya
     * 
     * @return
     * 
     */
    return this.dd.post("rel",entityName).pipe( //se consultan las relaciones de la entidad para armar el grupo de fields
      map(
        rel => {
          var r = fastClone(relationsFk)
          for(var i = 0; i < relationsFk.length; i++){ //se recorren los fields a consultar para identificar las relaciones faltantes
              if(relationsFk[i].includes("-")) { //ej ["per_dom-calle"]
                var k = relationsFk[i].substr(0, relationsFk[i].indexOf('-')); //ej k = "per_dom"
                if(k.includes("_")) { //ej: per_dom
                  var s = k.substr(0, k.lastIndexOf('_')); //ej s = "per"
                  if(r.indexOf(s) === -1) r.push(s) //ej: si no existe "per" en r, se agrega
                }
              }
          }
          return r
        }
      )
    )
  }


  public initializeRelationsFields(entityName: string, fields: string[]): Observable<any> {
    /**
     * @summary
     * Recorrer los campos indicados en el parametro fields e inicializar los campos de la relacion
     * 
     * @example
     * si desde alumno_comision, queremos recorrer persona, debemos pasar por alumno, 
     * entonces debe existir alu-persona por mas que no se incluya
     * 
     * @description
     * Para realizar correctamente las relaciones entre las distintas entidades
     * es necesario que existan ciertos campos de relacion
     * que pueden no estar incluidos en la consulta original
     
     * @description 2
     * A diferencia de las consultas retornadas del servidor, 
     * se utiliza el caracter - (guion medio) como separador, 
     * para facilitar posteriormente la identificacion de fields 
     * y la aplicacion de ciertas caracteristicas como por ejemplo ordenamiento
     */

    return this.dd.post("rel",entityName).pipe( //se consultan las relaciones de la entidad para armar el grupo de fields
      map(
        rel => {
          var f = []

          for(var i = 0; i < fields.length; i++){ //se recorren los fields a consultar para identificar las relaciones faltantes
            if(fields[i].includes("-")) { //ej per_dom-calle
              var k = fields[i].substr(0, fields[i].indexOf('-')); //ej: k = "per-dom"
              this.initializeRelationsFieldsRecursive(k,f,rel) //ej "per_dom",f,rel
            }
            if(f.indexOf(fields[i]) === -1) f.push(fields[i]) //ej f.push("per-dom-calle")
          }
          return f
        }
      )
    )
  }
  
  protected initializeRelationsFieldsRecursive(
    key: string, //ej per_dom
    f:string[], //array de fields resultante
    rel:any //array de relaciones
  ){
    /**
     * @summary
     * Metodo recursivo para complementar la inicializacion
     * 
     * @description
     * Permite recorrer el arbol de relaciones mediante una recursion
     */
    var subkey =  key.substr(0, key.lastIndexOf('_')); //ej subkey = "per"
    var s = "";
    if(key.includes("_")) {
      this.initializeRelationsFieldsRecursive(subkey, f, rel) //ej "per", f, rel
      s = subkey + "-" //ej "per-"
    } 
    if(f.indexOf(s+rel[key]["field_name"]) === -1) f.push(s+rel[key]["field_name"]) //ej "per-domicilio"
  }

  public filterFields(fields:string[], prefix) {
    /**
     * @summary
     * Filtra los fields en funcion del prefijo
     * Ejemplo prefix "per-", "per_dom-"
     * 
     * @return Ejemplo de retorno, si se recibe "per-domicilio", "per-"
     *   se retorna f["per-domicilio"] = "domicilio" 
     */
    var f = {}
    for(var i = 0; i < fields.length; i++){
      if(fields[i].includes(prefix)) f[fields[i]] = fields[i].substring(fields[i].indexOf("-")+1)
    }
    return f;
  }



}
