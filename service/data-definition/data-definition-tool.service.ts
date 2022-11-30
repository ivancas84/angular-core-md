import { Injectable } from '@angular/core';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { arrayUnique } from '@function/array-unique';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataDefinitionService } from './data-definition.service';

/**
 * Clase para facilitar la ejecucion del metodo entityFieldGetAll
 */
class EntityFieldsOrganize{

  /**
   * prefijo opcional, necesario cuando se debe hacer un merge entre distintas consultas
   */
  prefix: string = ""

  /**
   * entidad principal
   */
  entityName!: string 

  tree: { [index: string]: string[] } = {}

  /**
   * Arbol de fields a consultar
   * No incluye campos de la entidad principal
   */
  treeQuery: { [index: string]: string[] } = {}

  /**
   * Campos de la entidad principal
   * No incluye campos de la entidad principal
   */
  entityFields: string[] = []
  
  /**
   * Fields a consultar, 
   * Para optimizar la ejecucion pueden agregar campos fk adicionales
   */
  fields!:string[]

  /**
   * Relaciones de entityName
   */
  relations!: { [index: string]: any }

  fieldsIdOrder:string[] = [] //orden de consulta de fields id

  constructor(entityName: string, fields: string[]) {
    this.entityName = entityName;
    this.fields = fields;
  }

  setPrefix(prefix: string) { this.prefix = prefix }


  setRelations(relations: { [index: string]: any; }) { this.relations = relations }

  setTree(tree: { [index: string]: any; }) { this.tree = tree }

  /**
   * Recorrer lista de fields a consultar
   * Agregar fields fk adicionales si es necesario
   * Armar tree de consulta
   * 
   * @param index Indice para consultar, se llama recursivamente para facilitar
   */
  organizeTreeQuery(index: number): void{
    var fieldId = this.fields[index].substring(0, this.fields[index].indexOf("-"))
    if(fieldId) {
      var field: string = this.fields[index].substring((this.fields[index].indexOf("-")+1))
      if(!this.treeQuery.hasOwnProperty(fieldId)) this.treeQuery[fieldId] = []
      if(!this.treeQuery[fieldId].includes(field)) this.treeQuery[fieldId].push(field)

      var parentId:string = this.relations[fieldId]["parent_id"];
      var fieldName:string = this.relations[fieldId]["field_name"];
      var fkName:string = (parentId) ? parentId+"-"+fieldName : fieldName;
      if(!this.fields.includes(fkName)) this.fields.push(fkName)
    } else {
      this.entityFields.push(this.fields[index])
    }
    if(++index < this.fields.length) this.organizeTreeQuery(index)
  }

  organizeOrder(tree:{[i:string]:any}) {
    for(var fid in tree) {
      if(tree.hasOwnProperty(fid)) {
        var recorrerChildren = false;
        for(var j = 0 ; j < this.fields.length; j++) {  
          var fieldId = this.fields[j].substring(0, this.fields[j].indexOf("-"))
          if(fieldId && fieldId == fid && !this.fieldsIdOrder.includes(fieldId)) {
            this.fieldsIdOrder.push(fieldId)
            recorrerChildren = true
          }
        }

        if(recorrerChildren && !isEmptyObject(tree[fid]["children"])) this.organizeOrder(tree[fid]["children"])

      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionToolService extends DataDefinitionService{

  /**
   * Consulta de campos de una entidad y sus relaciones
   * Solo pueden consultarse los campos descriptos en el modelo
   */
  public entityFieldsGetAll({ entityName, ids, fields, prefix = "" }: { entityName: string; ids: string[]; fields: string[]; prefix?:string; }): Observable<any[]>{
    var efo: EntityFieldsOrganize = new EntityFieldsOrganize(entityName, fields)
    var response: {[index:string]:any}[] = []

    efo.setRelations(this.session.getItem("relations")[entityName]);
    efo.setTree(this.session.getItem("tree")[entityName]);
    // efo.organize(this.tree)
    efo.organizeTreeQuery(0)
    efo.organizeOrder(efo.tree)
    efo.setPrefix(prefix)

    return this.getAll(entityName, ids).pipe(
      map(
        data => {
          for(var i = 0; i < data.length; i++) {
            response[i] = {}
            for(var j = 0; j < efo.fields.length; j++) response[i][efo.prefix + efo.fields[j]] = null
            for(var j = 0; j < efo.entityFields.length; j++) response[i][efo.prefix + efo.entityFields[j]] = data[i][efo.entityFields[j]]
          }
          return response
        }
      ),
      switchMap(
        response =>this.traduceFieldIds(efo, response, 0)
      )
    )
  }

  public entityFieldsMergeAll({ data, entityName, fields, fieldNameData, fieldNameResponse, prefix = "" }: { 
    data: { [index: string]: any; }[]; 
    entityName: string; 
    fields: string[]; 
    fieldNameData: string; 
    fieldNameResponse: string; 
    prefix?:string ; 
   }, 
  ): Observable<{ [index: string]: any }[]>{
        /**
         * Similar a getMergeAll pero utiliza un "fieldName", en vez del "id" para realizar la consulta
         */
        if(!data.length) return of([]);
      
        if(!fields.hasOwnProperty(fieldNameResponse)) fields.push(fieldNameResponse)

        var ids = arrayColumn(data, fieldNameData).filter(function (el) { return el != null; });
        
        for(var i = 0; i < data.length; i++) {
          for(var j = 0; j < fields.length; j++) data[i][prefix+fields[j]] = null; //inicializar en null
        }
        
        return this.entityFieldsGetAll({entityName,ids,fields,prefix}).pipe(
          map(
            response => {
              if(!response.length) return data;
              for(var i = 0; i < data.length; i++){
                for(var j = 0; j < response.length; j++){
                  if(data[i][fieldNameData] == response[j][prefix+fieldNameResponse]) {
                    for(var k = 0; k < fields.length; k++) data[i][prefix+fields[k]] = response[j][prefix+fields[k]];
                    break;
                  }
                }
              }
              return data;
            }
          )
        );  
      }

  protected traduceFieldIds (
    efo:EntityFieldsOrganize, //clase de definicion
    response: { [index: string]: any }[], //datos
    index: number
  ): Observable<{ [index: string]: any }[]> {

    
    if(index < efo.fieldsIdOrder.length){
      return this.prefixGetAll(efo.fieldsIdOrder[index], efo, response).pipe(
        switchMap(
          response => {
            return (++index < efo.fieldsIdOrder.length) ? this.traduceFieldIds(efo, response, index) : of(response)
          }
        )
      )
    }

    return of(response)
    
  }

  /** 
   * Consultar datos de "entityName" utilizando "data[fkName]" como ids
   * A cada campo consultado asignar el prefijo "fieldId"
   * Mergear el resultado con "data"
   */
  protected prefixGetAll(
      fieldId: string, //asignar fieldId a cada campo de resultado
      efo: EntityFieldsOrganize,
      response: { [index: string]: any }[],
  ): Observable<{[x:string]:any}[]>{
      if(!response.length) return of(response);

      var entityName:string = efo.relations[fieldId]["entity_name"];
      var parentId:string = efo.relations[fieldId]["parent_id"];
      var fieldName:string = efo.relations[fieldId]["field_name"];
      var fkName:string = (parentId) ? efo.prefix+parentId+"-"+fieldName : efo.prefix+fieldName;

      var ids = arrayUnique(
        arrayColumn(response, fkName).filter(function (el) { return el != null; })
      );

      return this.getAll(entityName, ids).pipe(
        map(
          data => {
            if(!data.length) return response;

            for(var i = 0; i < response.length; i++){
              for(var j = 0; j < data.length; j++){
                if(response[i][fkName] == data[j]["id"]) {
                  for(var k = 0; k < efo.treeQuery[fieldId].length; k++) {
                    var n = efo.treeQuery[fieldId][k]
                    response[i][efo.prefix+fieldId+"-"+n] = data[j][n]
                  }
                  break;
                }
              }
            }
            return response;
          }
        )
      );
  }

  public entityFieldsGet(entityName: string, id:string, fields:string[],):  Observable<{ [index: string]: any }>{
    var efo: EntityFieldsOrganize = new EntityFieldsOrganize(entityName, fields)
    var response: {[index:string]:any} = {}
    
    return this.getRelations().pipe(
      switchMap(
        relations => {
          efo.setRelations(relations[entityName]);
          efo.organizeTreeQuery(0)

          return this.get(entityName, id)
        }
      ),
      map(
        data => {
          for(var j = 0; j < efo.fields.length; j++) response[efo.fields[j]] = null
          for(var j = 0; j < efo.entityFields.length; j++) response[efo.entityFields[j]] = data[efo.entityFields[j]]
        
          return response
        }
      ),
      switchMap(
        response =>this.traduceFieldId(efo, response, [])
      )
    )
  }

  protected traduceFieldId (
    efo:EntityFieldsOrganize, //clase de definicion
    response: { [index: string]: any }, //datos
    fieldIdQuery_: string[] //control de campos consultados y recursion
  ): Observable<{ [index: string]: any }> {
    var fieldId_ = Object.keys(efo.tree)
    for(var index = 0; index < fieldId_.length; index++){
      if(!fieldIdQuery_.includes(fieldId_[index])) break;
    }
    if(index >= fieldId_.length) return of(response); //CONTROL DE RECURSION

    var fieldId = fieldId_[index]
    var parentId:string = efo.relations[fieldId]["parent_id"];
    fieldIdQuery_.push(fieldId)

    if(parentId && !fieldIdQuery_.includes(parentId)) { 
      return this.traduceFieldId(efo, response, fieldIdQuery_).pipe(
        switchMap(
          response => {
            return this.prefixGet(fieldId, efo, response).pipe(
              switchMap(
                response => {
                  return (++index < efo.fields.length) ? this.traduceFieldId(efo, response, fieldIdQuery_) : of(response)
                }
              )
            )
          }
        )
      )
    } else {
      return this.prefixGet(fieldId, efo, response).pipe(
        switchMap(
          response => {
            return (++index < efo.fields.length) ? this.traduceFieldId(efo, response, fieldIdQuery_) : of(response)
          }
        )
      )
    }
  }

  /** 
   * Consultar datos de "entityName" utilizando "data[fkName]" como ids
   * A cada campo consultado asignar el prefijo "fieldId"
   * Mergear el resultado con "data"
   */
   protected prefixGet(
    fieldId: string, //asignar fieldId a cada campo de resultado
    efo: EntityFieldsOrganize,
    response: { [index: string]: any },
): Observable<{[x:string]:any}>{
    var entityName:string = efo.relations[fieldId]["entity_name"];
    var parentId:string = efo.relations[fieldId]["parent_id"];
    var fieldName:string = efo.relations[fieldId]["field_name"];
    var fkName:string = (parentId) ? parentId+"-"+fieldName : fieldName;

    var id = response[fkName]
    if(!id) return of(response)
    return this.get(entityName, id).pipe(
      map(
        data => {
          if(response[fkName] == data["id"]) {
            for(var k = 0; k < efo.tree[fieldId].length; k++) {
              var n = efo.tree[fieldId][k]
              response[fieldId+"-"+n] = data[n]
            }                
          }
        
          return response;
        }
      )
    );
}


  public getMergeAll({ data, entityName, fields, fkName }: {
    data: { [index: string]: any; }[]; 
    entityName: string; 
    fields: { [index: string]: any; }; /**
     * Objeto para filtrar los campos.
     *
     * Ciertos campos de entityName tienen el mismo nombre que la relacion de
     * origen, a partir del parametro fields, se puede asignar un alias.
     * Debe tenerse el cuidado de que para data se utilice un alias diferente
     * para cada campo.
     *
     * @example {"alias":"name"}
     */
    fkName?: string;
}, //se utiliza para definir ids = data[fkName]
  ): Observable<{ [index: string]: any }[]>{
    /**
     * @summary
     * Consulta de relaciones directas.
     * Define un array de identificadores "ids" a partir de los parametros 
     * "data[fkName]".
     * Consulta todos los campos del parametro "entityName" utilizando "ids" 
     * para obtener "response".
     * Recorre "data" y "response", compara "data[i][fkName]" con 
     * "response[j][id]" y realiza una asociacion.
     * La asociacion se realiza mediante parametro "fields", objeto compuesto
     * por "{nombre_asociacion:nombre_field}".
     * Solo trabaja con los campos de la entidad, no trabaja con sus relacio-
     * nes (esto es porque internamente llama a getAll, metodo que filtra los
     * campos principales).
     * En el caso de querer consultar directamente campos de relaciones o 
     * avanzados, utilizar selectConnection o procesar el resultado.
     * No se recomienda utilizar selectConnection porque no usa storage.
     */
    if(!fkName) fkName = entityName
    if(!data.length) return of([]);
    var ids = arrayUnique(
      arrayColumn(data, fkName).filter(function (el) { return el != null; })
    );
    
    for(var i = 0; i < data.length; i++) {
      for(var f in fields){
        if(fields.hasOwnProperty(f)) data[i][f] = null; //inicializar en null
      }
    }
    
    if(!ids.length) return of(data);
    
    return this.getAll(entityName, ids).pipe(
      map(
        response => {
          if(!response.length) return data;

          for(var i = 0; i < data.length; i++){
            for(var j = 0; j < response.length; j++){
              if(data[i][fkName!] == response[j]["id"]) {
                for(var f in fields){
                  if(fields.hasOwnProperty(f))                    
                    data[i][f] = response[j][fields[f]];
                }
                break;
              }
            }
          }
          return data;
        }
      )
    );  
  }

  getMergeAll2({ data, entityName, fields, fkName }: {
    data: { [index: string]: any; }[]; 
    entityName: string; 
    fields: { [index: string]: any; }; /**
     * Objeto para filtrar los campos.
     *
     * Ciertos campos de entityName tienen el mismo nombre que la relacion de
     * origen, a partir del parametro fields, se puede asignar un alias.
     * Debe tenerse el cuidado de que para data se utilice un alias diferente
     * para cada campo.
     *
     * @example {"alias":"name"}
     */
    fkName: string;
  }): Observable<{ [index: string]: any }[]>{
    /**
     * @summary
     * Variante de getMergeAll que realiza asociacion uno a uno.
     * El objetivo es lograr una mayor eficiencia
     */
    if(!data.length) return of([]);
    var ids = arrayColumn(data, fkName).filter(function (el) { return el != null; })
    

    for(var i = 0; i < data.length; i++) {
      for(var f in fields){
        if(fields.hasOwnProperty(f)) data[i][f] = null; //inicializar en null
      }
    }
    
    if(!ids.length) return of(data);
    
    return this.getAll(entityName, ids).pipe(
      map(
        response => {
          if(!response.length) return data;

          for(var j = 0; j < response.length; i++){
            for(var i = 0; i < data.length; j++){
              if(data[i][fkName] == response[j]["id"]) {
                for(var f in fields){
                  if(fields.hasOwnProperty(f))                    
                    data[i][f] = response[j][fields[f]];
                }
                break;
              }
            }
          }
          return data;
        }
      )
    );  
  }

  mergeAll(
{ data, entityName, fields, fkName, fieldName }: { 
    data: { [index: string]: any; }[]; 
    entityName: string; 
    fields: { [index: string]: any; }; 
    fkName: string; 
    fieldName: string; }, 
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Similar a getMergeAll pero utiliza un "fieldName", en vez del "id" para realizar la consulta
     */
    if(!data.length) return of([]);

    var ids = arrayColumn(data, fkName).filter(function (el) { return el != null; });
    
    for(var i = 0; i < data.length; i++) {
      for(var f in fields){
        if(fields.hasOwnProperty(f)) data[i][f] = null; //inicializar en null
      }
    }
    
    if(!ids.length) return of(data);
    
    var display = new Display();
    display.setSize(0);
    display.setCondition([fieldName,"=",ids]);
    return this.all(entityName, display).pipe(
      map(
        response => {
          if(!response.length) return data;
          for(var i = 0; i < data.length; i++){
            for(var j = 0; j < response.length; j++){
              if(data[i][fkName] == response[j][fieldName]) {
                for(var f in fields){
                  if(fields.hasOwnProperty(f))                    
                    data[i][f] = response[j][f];
                }
                break;
              }
            }
          }
          return data;
        }
      )
    );  
  }
  
  postMergeAll({ data, method, entityName, fields, fieldNameData, fieldNameResponse }: { 
    data: { [index: string]: any; }[]; 
    method: string; 
    entityName: string; 
    fields: { [index: string]: any; }; 
    fieldNameData?: string; 
    fieldNameResponse?: string; 
  }): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta de relaciones directas para metodos no habituales
     * Procedimiento similar a getMergeAll
     * Define un array de identificadores "ids" a partir de los parametros "data[fieldNameData]"
     * Consulta todos los campos del parametro "entityName" utilizando "ids" y parametro "method" para obtener "response"
     * Recorre "data" y "response", compara "data[i][fieldNameData]" con "response[j][fieldNameResponse]" y realiza una asociacion
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     * En la medida de lo posible evitar el uso de este metodo ya que no utiliza storage
     */

    if(!fieldNameData) fieldNameData = entityName;
    if(!fieldNameResponse) fieldNameResponse = fieldNameData;

    if(!data.length) return of([]);
    data.forEach(element=>{
      for(var f in fields){
        if(fields.hasOwnProperty(f)) {
          element[f] = null; //inicializar en null
        }
      }
    })
      
    var ids_ = arrayColumn(data, fieldNameData).filter(function (el) { return el != null; })

    var ids = arrayUnique(ids_);

    if(!ids.length) return of(data);

    return this._post(method,entityName,ids).pipe(
      map(
        response => {
          if(!response.length) return data;
          for(var i = 0; i < data.length; i++){
            for(var j = 0; j < response.length; j++){
              if(data[i][fieldNameData!] == response[j][fieldNameResponse!]){
                for(var f in fields){
                  if(fields.hasOwnProperty(f)) data[i][f] = response[j][fields[f]];
                }
                break;
              }
            }
          }
          return data;
        }
      )
    );  
  }

  postMergeAll_({ data, method, entityName, fields, fieldNameData, fieldNameResponse }: { 
    data: { [index: string]: any; }[]; 
    method: string; 
    entityName: string; 
    fields: string[]; 
    fieldNameData?: string; 
    fieldNameResponse?: string; 
  }): Observable<{ [index: string]: any }[]>{
    var fieldsObj: {[index:string]:any} = {}
    for(var i = 0; i < fields.length; i++) fieldsObj[fields[i]] = fields[i]
    return this.postMergeAll({data,method,fields:fieldsObj,entityName,fieldNameData,fieldNameResponse})
  }

  postMergeAll2(
    data: { [index: string]: any }[], 
    method:string,
    entityName: string, 
    fields: { [index: string]: any },
    fieldNameData: string,
    fieldNameResponse: string, 
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Variante de postMergeAll que espera recibir un conjunto reducido 
     * de respuestas que puede ser utilizado en varias filas
     */
    if(!data.length) return of([]);
    data.forEach(element=>{
      for(var f in fields){
        if(fields.hasOwnProperty(f)) {
          element[f] = null; //inicializar en null
        }
      }
    })
      
    var ids = arrayColumn(data, fieldNameData).filter(function (el) { return el != null; })

    if(!ids.length) return of(data);

    return this._post(method,entityName,ids).pipe(
      map(
        response => {
          if(!response.length) return data;
          for(var j = 0; j < response.length; j++){
            for(var i = 0; i < data.length; i++){
              if(data[i][fieldNameData] == response[j][fieldNameResponse]){
                for(var f in fields){
                  if(fields.hasOwnProperty(f)) data[i][f] = response[j][fields[f]];
                }
                break
              }
            }
          }
          return data;
        }
      )
    );  
  }
  
  getMergeAllUm(
    data: { [index: string]: any }[], 
    fieldName: string = "id", //se obtiene el conjunto de identificadores data[fieldName], habitualmente fieldName es id
    fkName: string, //se asocia el conjunto de identificadores a fkName (fk de entityName) 
    entityName: string, 
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta relaciones um de un conjunto de datos
     * Define un conjunto de identificadores "ids", filtrando del parametro 
     * "data" el campo "fieldName".
     * Consulta todos los campos del parametro "entityName" utilizando el pa-
     * rametro "fkName" "(fkName = ids)"
     * Recorre "data" y "response", compara "data[i][fkName]" con 
     * "response[j][id]" y realiza un push de cada coincidencia.
     * Los elementos coincidentes se almacenan en data[i][fkName+"_"].
     * Al no ser una "asociacion" no hace falta filtrar datos, directamente se
     * almacena todo el cada resultado como elemento de un array
     */
    if(!data.length) return of([]);
    var ids = arrayColumn(data, fieldName);
    if(!ids.length) return of(data);
    var display = new Display();
    display.setSize(0);
    display.addParam(fkName,ids);
    return this.all(entityName, display).pipe(
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

  postMergeAllUm(
    data: { [index: string]: any }[], 
    method:string,
    entityName: string, 
    fields: { [index: string]: any },
    fieldNameData?: string,
    fieldNameResponse?: string, 
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta relaciones um de un conjunto de datos
     * Define un conjunto de identificadores "ids", filtrando del parametro 
     * "data" el campo "fieldName".
     * Consulta todos los campos del parametro "entityName" utilizando el pa-
     * rametro "fkName" "(fkName = ids)"
     * Recorre "data" y "response", compara "data[i][fkName]" con 
     * "response[j][id]" y realiza un push de cada coincidencia.
     * Los elementos coincidentes se almacenan en data[i][fkName+"_"].
     * Al no ser una "asociacion" no hace falta filtrar datos, directamente se
     * almacena todo el cada resultado como elemento de un array
     */
    
     if(!fieldNameData) fieldNameData = entityName;
     if(!fieldNameResponse) fieldNameResponse = fieldNameData;
     if(!data.length) return of([]);
     data.forEach(element=>{
       element["_"+fieldNameData] = null; //inicializar en null
     })
     
    var ids_ = arrayColumn(data, fieldNameData);
    var ids = arrayUnique(ids_);
    if(!ids.length) return of(data);

    return this._post(method,entityName,ids).pipe(
      map(
        response => {
          // for(var i = 0; i < data.length; i++) data[i]["_"+entityName] = []; //inicializar
          // if(!response.length) return data;
          // for(var j = 0; j < response.length; j++){
          //   for(var i = 0; i < data.length; i++) { 
          //     if(response[j][fkName] == data[i][fieldName]) 
          //       data[i]["_"+entityName].push(response[j]);
          //   }
          // }
          return data;
        }
      )
    );  
  }

  postMergeUm(
    data: { [index: string]: any }[], 
    fields: { [index: string]: string }, //fields a consultar (no deben ser funciones de agregacion)
    fkName: string, //se asocia el conjunto de identificadores a fkName (fk de entityName) 
    entityName: string,
    fieldName: string = "id", //se obtiene el conjunto de identificadores data[fieldName], habitualmente fieldName es id
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta avanzada de relaciones um de un conjunto de datos
     * 
     * Define un conjunto de identificadores "ids", 
     * filtrando del parametro "data" el campo "fieldName"
     * 
     * Consulta los campos "fields" de la entidad "entityName"
     * filtrando por "fkName" "(fkName = ids)"
     * 
     * Recorre "data" y "response", 
     * compara "data[i][fkName]" con "response[j][fieldName]" 
     * y realiza un push de cada coincidencia
     * los elementos coincidentes se almacenan en data[i]["_"+fkName]
     * 
     * Al no ser una "asociacion" no hace falta filtrar datos, 
     * directamente se almacena todo el cada resultado 
     * como elemento de un array
     * 
     * Se utiliza la nomenclartura "_"+fkName para diferenciarla de fkName+"_" 
     * utilizada para almacenar un json de la relacion de datos consultada
     * 
     * Siempre que se pueda utilizar el metodo getMergeAllUm,
     * ya que implementa storage 
     */
    if(!data.length) return of([]);

    for(var i = 0; i < data.length; i++) data[i]["_"+entityName] = []; //inicializar

    var ids = arrayColumn(data, fieldName);
    if(!ids.length) return of(data);

    fields[fieldName]=fieldName; //siempre debe existir el fieldName para comparar el resultado

    var display = new Display();
    display.setSize(0);
    display.setFields(fields);
    display.addParam(fkName,ids);
    return this._post("advanced",entityName, display).pipe(
      map(
        response => {
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

  mergeGet({ data, entityName, fields, fkName = "id" }: {
    data: { [index: string]: any; }; 
    entityName: string; 
    fields: { [index: string]: any; }; 
    fkName?: string;
  }): Observable<{ [index: string]: any }>{
    /**
     * Consulta un solo elemento del parametro "entityName" utilizando los parametros "data[fkName]" para obtener "response" 
     * Efectua una asociacion 
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     */
    if(!fkName) fkName = entityName;
    if(!isEmptyObject(data)) for(var f in fields) data[f] = null;
    return this.get(entityName, data[fkName]).pipe(
      map(
        response => {
          if(!response) return data;
          for(var f in fields){
            if(fields.hasOwnProperty(f)) data[f] = response[fields[f]];
          }
          return data;
        }
      )
    );  
  }

  mergeGet_({ data, entityName, fields, fkName = "id" }: {
    data: { [index: string]: any; }; 
    entityName: string; 
    fields: string[]; 
    fkName?: string;
  }): Observable<{ [index: string]: any }>{
    /**
     * Consulta un solo elemento del parametro "entityName" utilizando los parametros "data[fkName]" para obtener "response" 
     * Efectua una asociacion 
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     */
    var fieldsObj: {[index:string]:string} = {}
    for(var i =0; i < fields.length; i++) fieldsObj[fields[i]] = fields[i]
    return this.mergeGet({data,entityName,fields:fieldsObj,fkName})
  }

  mergeObjectGet({data,entityName,fields,id,fkName,idResponse}:{
    data: { [index: string]: any },
	  entityName: string, 
    fields: { [index: string]: any },
    id: string,
	  fkName?: string, 
    idResponse?: string
  }): Observable<{ [index: string]: { [index: string]: any } }>{
    /**
     * Similar a mergeGet pero utiliza una estructura de datos diferente de la forma
     * data["alumno"] = {id:"value",activo:"value"} 
     * data["persona"] = {id:"value",activo:"value"}
     */
    if(!fkName) fkName = entityName;
    if(!idResponse) idResponse = fkName;
    //ej persona _u domicilio 
    //-> entityName = domicilio, fkName = domicilio, idResponse = domicilio

    data[idResponse] = {};
    if(!isEmptyObject(data)) {
      for(var f in fields) data[idResponse][f] = null;
    }

    if(!data[id][fkName]) return of(data);
 
    return this.get(entityName, data[id][fkName]).pipe(
      map(
        response => {
          if(!response) return data;
          for(var f in fields){
            if(fields.hasOwnProperty(f)) data[idResponse!][f] = response[fields[f]];
          }
          return data;
        }
      )
    );  
  }

  mergeObjectGet_({data, entityName, fields, id, fkName, idResponse}: {
    data: { [index: string]: any },
	  entityName: string, 
    fields: string[],
    id: string,
	  fkName?: string, 
    idResponse?: string}
  ): Observable<{ [index: string]: { [index: string]: any } }>{
    var fieldsObj: {[index:string]:any} = {}
    for(var i = 0; i < fields.length; i++) fieldsObj[fields[i]] = fields[i]
    return this.mergeObjectGet({data, entityName, fields:fieldsObj, id, fkName, idResponse})
  }

  selectConnection(
    data: { [index: string]: any }[], 
    fields: { [index: string]: string }, 
    /**
     * Campos a filtrar ((no deben ser funciones de agregacion)).
     * 
     * @description
     *   {alias:campo}
     * 
     * @example
     *   {sede:"sed-nombre"}
     */
    entityName: string, 
    fkName: string,
    fieldName: string = "id", 
  ): Observable<{ [index: string]: any }[]>{
    /**
     * @todo faltaria agregar un fieldName y no utilizar siempre el id
     * Define un conjunto de identificadores "ids".
     * Para definir "ids", recorre el parametro "data y define un array fil-
     * trando el parametro "fkName".
     * Realiza una consulta avanzada de la entidad identificada con el para-
     * metro "entityName".
     * Los campos de la consulta avanzada se definen en el parametro "fields".
     * Recorre "data" y "response", compara "data[i][fkName]" con 
     * "response[j][fieldName]" y realiza una asociacion.
     * La asociacion se realiza mediante parametro "fields", objeto compuesto 
     * por "{nombre_asociacion:nombre_field}"
     * En la medida de lo posible evitar el uso de este metodo ya que no alma-
     * cena cache.
     */
    if(!data.length) return of([]);
    var ids = arrayColumn(data, fkName).filter(function (el) { return el != null; });
    if(!ids.length) return of(data);
    for(var i = 0; i < data.length; i++) {
      for(var f in fields){
        if(fields.hasOwnProperty(f)) data[i][f] = null; //inicializar en null
      }
    }

    var display = new Display();
    var fields_ = fastClone(fields); //auxiliar de fields para incluir el id
    if(!fields_.hasOwnProperty(fieldName)) fields_[fieldName]=fieldName; //siempre debe existir el id para comparar el resultado
    display.setFields(fields_);
    display.addCondition([fieldName,"=",ids]);
    return this._post("advanced",entityName, display).pipe(
      map(
        response => {
          if(!response) return data;
          for(var i = 0; i < response.length; i++){
            for(var j = 0; j < data.length; j++){
              if(data[j][fkName] == response[i][fieldName]) {
                for(var f in fields){
                  if(fields.hasOwnProperty(f))                    
                    data[j][f] = response[i][f];
                }
                break;
              }
            }
          }
          return data;
        }
      )
    );  
  }

  selectConnectionGroup(
    data: { [index: string]: any }[], 
    fieldName: string, 
    entityName: string, 
    fields: { [index: string]: string }, //utilizar solo funciones de agregacion
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta avanzada de relaciones con agrupamiento
     * Define "ids" filtra el campo "id" del parametro "data"
     * Define "display.fields", asigna el parametro fields
     * Define "display.group", asigna el parametro fieldName
     * Define "display.condition", utiliza el parametro "fieldName" y el array ids
     * Consulta entidad indicada en parametro "entityName" para obtener "response"
     * Realiza asociacion entre "data" y "response"
     * Si data[i]["id"] == response[j][fieldName] almacena en data los campos indicados en parametro "fieldsResponse"
     * "fieldsResponse" es un objeto de la forma {nombre_identificacion:nombre_field}
     * si "nombre_field" es un array realiza un join utilizando el parametro "join"
     * A diferencia de las consultas no avanzadas, se especifican los fields directamente en la consulta y se retornan dichos fields que seran asignados
     * Tiene la ventaja de que se reducen los parametros, pero como desventaja no utilizan el storage para las entities.
     * En la medida de lo posible evitar el uso de este metodo ya que no utiliza storage.
     */

    var ids = arrayColumn(data, "id")
    for(var i = 0; i < data.length; i++) {
      for(var f in fields){
        if(fields.hasOwnProperty(f)) data[i][f] = null; //inicializar en null
      }
    }
    if(!ids.length) return of(data);
    var d = new Display().setSize(0).setFields(fields).setGroup_([fieldName]).addCondition([fieldName,"=",ids]);
    return this._post("select",entityName, d).pipe(
      map(
        response => {
          for(var i = 0; i < data.length; i++){
            for(var j = 0; j < response.length; j++){
              if(data[i]["id"] == response[j][fieldName]) {
                for(var f in fields){
                  if(fields.hasOwnProperty(f)) data[i][f] = response[j][f];
                }
                break;
              }
            }
          }
          return data;
        }
      )
    );  
  }

}
