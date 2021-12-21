import { Injectable } from '@angular/core';
import { Display } from '@class/display';
import { FormConfig } from '@class/reactive-form-config';
import { arrayColumn } from '@function/array-column';
import { isEmptyObject } from '@function/is-empty-object.function';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataDefinitionToolService } from './data-definition-tool.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionRelFieldsService {
  /**
   * Servicio de inicializacion de campos de una entidad y sus relaciones
   */

  constructor(
    protected dd: DataDefinitionToolService, 
  ) { }

  public getAll(entityName: string, ids: string[], fields: string[]): Observable<any> {
    /**
     * @todo Renombrar a getAllFields
     * 
     * @param entityName Nombre de la entidad
     * @param ids ids de entityName
     * @param fields Campos de entityName y sus relaciones obtenidos de configuracion,
     *   las relaciones se definen con "prefix-"
     *   Ejemplo de fields (per-numero_documento)
     *
     * @example Ejemplo de retorno (para la entidad principal alumno)
     *   [{id:"value", activo:true, per-id:"value", per-numero_documento:"value"},...]
     * 
     * @summary
     * Se efectuan tres acciones principales:
     *   1) Inicializar los campos de una entidad y sus relaciones
     *      No se inicializan todas las relaciones, 
     *      solo las que se determinan en el parametor "fields"
     *   2) Obtener los datos de entityName en base a ids
     *   3) Obtener el mapa de las relaciones ("rel")
     *   4) Combinar y armar una respuesta en base a 1, 2 y 3.
     *
     * @description
     * A diferencia de las consultas retornadas del servidor, 
     * se utiliza el caracter - (guion medio) como separador 
     * para facilitar posteriormente la identificacion de fields 
     * y la aplicacion de ciertas caracteristicas como por ejemplo ordenamiento
     */
    return combineLatest([
      this.initializeFields(entityName, fields),
      this.dd.getAll(entityName, ids)
    ]).pipe(
      switchMap(
        response => {
          var fieldsInitialized = response[0];
          var data = response[1];
          return this.dd.post("rel",entityName).pipe(
            switchMap(
              rel => {
                return this.getAllLoop(data, rel, fieldsInitialized)
              }
            )
          )
        }
      )
    )
  }

  protected getAllLoop(
    data, //resultado de consulta para initializar 
    rel, //objeto con el arbol de relaciones
    fieldsInitialized:string[] //campos inicializados con relaciones
  ) {
    /**
     * @summary
     * Metodo complementario de inicializacion
     * 
     * @description
     * 1) Recorre el arbol de relaciones
     * 2) Para cada relacion obtiene los fields de la correspondiente entidad
     * 3) Define un elemento formado por campos de la entidad de la relacion recorrida, nombre entidad recorrida y prefijo de clave foranea
     * 4) Invoca a metodo recursivo chainging para recorrer el conjunto de elementos definido 
     * 
     * @description 2
     * Para definir el prefijo de la clave foranea verifica la existencia del caracter _
     * Si existe _ significa que se esta recorriendo una fk indirecto, 
     * por lo tanto debe inlcuirse el correspondiente prefijo en la clave foranea 
     * Ejemplo per_dom, se define como per-domicilio
     * 
     * Si no existe _ significa que se esta recorriendo una fk directa,
     * Ejemplo per, se define como persona  
     */
    var keys =  Object.keys(rel);
    var elements = []
    for(var j = 0; j < keys.length; j++) {
      if(rel.hasOwnProperty(keys[j])) {
        var fields = this.filterFields(fieldsInitialized, keys[j]+"-");
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

  protected chaining(
    data, //conjunto de datos 
    elements, //conjunto de elementos formado por fields: string de campos, entityName: nombre de la entidad, fkName: nombre de la fk (con prefijo)
    i //indice recorrido
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
    
  public getAllGroup(
    entityName: string, //entidad principal
    ids: string[], //ids de entityName
    controls:{ [index: string]: FormConfig } //objeto de configuracion
  ){
    /**
     * @todo Renombrar a getAll (ojo que ya existe getAll que debe ser renombrada a getAllFields)
     * 
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
       this.getAll(entityName, ids, fields);
  }

  um(
    data: { [index: string]: any }[], 
    fieldName: string = "id", //se obtiene el conjunto de identificadores data[fieldName], habitualmente fieldName es id
    fkName: string, //se asocia el conjunto de identificadores a fkName (fk de entityName) 
    entityName: string, 
    fields: string[]
  ){
    /**
     * Consulta relaciones um de un conjunto de datos
     * Define un conjunto de identificadores "ids", filtrando del parametro "data" el campo "fieldName"
     * Consulta todos los campos del parametro "entityName" utilizando el parametro "fkName" "(fkName = ids)"
     * Recorre "data" y "response", compara "data[i][fkName]" con "response[j][id]" y realiza un push de cada coincidencia
     * los elementos coincidentes se almacenan en data[i]["_"+fkName]
     * esta nomenclatura se diferencia del retorno del servidor que almacena las fk como fkName+"_"
     * Al no ser una "asociacion" no hace falta filtrar datos, 
     * directamente se almacena todo el cada resultado 
     * como elemento de un array
     */
     if(!data.length) return of([]);
     var ids = arrayColumn(data, fieldName);
     if(!ids.length) return of(data);
     var display = new Display();
     display.setSize(0);
     display.addParam(fkName,ids);
     return this.dd.post("ids",entityName, display).pipe(
       switchMap(
         ids => {
          return this.getAll(entityName,ids,fields)}
       ),
       map(
         response => {
           for(var i = 0; i < data.length; i++) data[i]["_"+entityName] = []; //inicializar
           if(!response.length) return data;
           for(var j = 0; j < response.length; j++){
             for(var i = 0; i < data.length; i++) { 
               if(response[j][fkName] == data[i][fieldName]) 
                 data[i]["_"+entityName].push(response[j]);
             }
           }
           return data;
         }
       )
     );
  }

  public fields(entityName, fields, row){
    return this.dd.post("rel",entityName).pipe(
      switchMap(
        rel => {
          var obs: Observable<{ [index: string]: any; }>;
          var keys =  Object.keys(rel);
          for(var i = 0; i < keys.length; i++){
            try{throw i} catch(j){
              if(rel.hasOwnProperty(keys[j])){
                if(!isEmptyObject(this.filterFields(fields, keys[j]+"-"))) {
                  if(!obs){
                    // data: { [index: string]: any }, 
                    // fkName: string, 
                    // entityName: string, 
                    // fields: { [index: string]: any },
                    // join:string=", "
                  
                    obs = this.dd.getConnection(
                      row, 
                      ((keys[j].includes("_")) ? keys[j].substr(0, keys[j].lastIndexOf('_'))+"-" : "") + rel[keys[j]]["field_name"],
                      rel[keys[j]]["entity_name"], 
                      this.filterFields(fields, keys[j]+"-")
                    )
                  } else {
                    obs = obs.pipe(
                      switchMap(
                        (d:any) => {
                          return this.dd.getConnection(d, 
                            ((keys[j].includes("_")) ? keys[j].substr(0, keys[j].lastIndexOf('_'))+"-" : "") + rel[keys[j]]["field_name"],
                            rel[keys[j]]["entity_name"], 
                            this.filterFields(fields, keys[j]+"-"))}
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
      this.initializeFields(entityName, fields),
      this.dd.get(entityName, id)
    ]).pipe(
      switchMap(
        response => {
          var fieldsInitialized = response[0];
          var data = response[1];
          return this.fields(entityName, fieldsInitialized, data)
          
        }
      )
    )
  }


  protected initializeFieldsRel(
    key: string, 
    f:string[], 
    rel:any
  ){
    /**
     * @summary
     * Metodo recursivo para complementar a initializeFieds
     * 
     * @description
     * Permite recorrer el arbol de relaciones mediante una recursion
     */
    var subkey =  key.substr(0, key.lastIndexOf('_'));
    var s = "";
    if(key.includes("_")) {
      this.initializeFieldsRel(subkey, f, rel)
      s = subkey + "-"
    } 
    if(f.indexOf(s+rel[key]["field_name"]) === -1) f.push(s+rel[key]["field_name"])
  }

  protected initializeFields(entityName: string, fields: string[]): Observable<any> {
    /**
     * @summary
     * Para realizar correctamente las relaciones entre las distintas entidades
     * es necesario que existan ciertos campos de relacion
     * que pueden no estar incluidos en la consulta original
     * el metodo initializeFields recorre los campos indicados en el parametro
     * e inicializa los fields de relacion
     * por ejemplo, si desde alumno_comision, queremos recorrer persona, debemos pasar por alumno, 
     * entonces debe existir alu-persona por mas que no se incluya
     * 
     * @description
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
            if(fields[i].includes("-")) {
              var k = fields[i].substr(0, fields[i].indexOf('-'));
              this.initializeFieldsRel(k,f,rel)
            }
            if(f.indexOf(fields[i]) === -1) f.push(fields[i])  
          }
          return f
        }
      )
    )
  }

  protected filterFields(fields:string[], prefix) {
    /**
     * Filtra los fields en funcion del prefijo
     * Ejemplo prefix "per-", "per_dom-"
     */
    var f = {}
    for(var i = 0; i < fields.length; i++){
      if(fields[i].includes(prefix)) f[fields[i]] = fields[i].substring(fields[i].indexOf("-")+1)
    }
    return f;
  }

}
