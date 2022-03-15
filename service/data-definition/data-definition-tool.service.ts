import { Injectable } from '@angular/core';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { fastClone } from '@function/fast-clone';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataDefinitionService } from './data-definition.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionToolService extends DataDefinitionService{
  
  public initFields(
    data: { [index: string]: any },
    fields:{ [index: string]: string } | string[],
  ){
    if(Array.isArray(fields)) {
      for(var f in fields) data[fields[f]] = null
    } else { 
      for(var f in fields){
        if(fields.hasOwnProperty(f)) data[f] = null; //inicializar en null
      }
    }

  }

  public assignFields(
    data: { [index: string]: any }, 
    response: { [index: string]: any }, 
    fields:{ [index: string]: string } | string[], 
    join: string = ", "
  ){
    /**
     * Asociar respuesta a datos
     * Al trabajar por referencia se reflejan los datos en los parametros
     */
    if(Array.isArray(fields)){
      for(var f in fields) data[fields[f]] = response[fields[f]]
    } else {
      for(var f in fields){
        if(fields.hasOwnProperty(f)) {                    
          if(Array.isArray(fields[f])) {
            var d = [];
            for(var k = 0; k < fields[f].length; k++) d.push(response[fields[f][k]])
            data[f] = d.join(join);
          } else {
            data[f] = response[fields[f]];
          }
        }
      }
    }
  }

  protected assignFieldsObj(
    data: { [index: string]: any }, 
    id:string,
    response: { [index: string]: any }, 
    fields:{ [index: string]: string }, 
    join: string = ", ",
  ){
    /**
     * Asociar respuesta a datos
     * Al trabajar por referencia se reflejan los datos en los parametros
     */
    for(var f in fields){
      if(fields.hasOwnProperty(f)) {                    
        if(Array.isArray(fields[f])) {
          var d = [];
          for(var k = 0; k < fields[f].length; k++) d.push(response[fields[f][k]])
          data[id][f] = d.join(join);
        } else {
          data[id][f] = response[fields[f]];
        }
      }
    }
  }

  getAllConnection(
    data: { [index: string]: any }[], //array de datos que se utilizaran para consultar y luego seran asociados
    fkName: string, //se utiliza para definir ids = data[fkName]
    entityName: string, //nombre de la entidad principal
    fields: { [index: string]: any } | string[], //objeto para realizar la asociacion de resultados
    join: string = ", ", //concatenacion en cado de que fields tenga un array como elemento
  ): Observable<{ [index: string]: any }[]>{
    /**
     * @summary
     * Consulta de relaciones directas
     * Define un array de identificadores "ids" a partir de los parametros "data[fkName]"
     * Consulta todos los campos del parametro "entityName" utilizando "ids" para obtener "response"
     * Recorre "data" y "response", compara "data[i][fkName]" con "response[j][id]" y realiza una asociacion
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     */
    if(!data.length) return of([]);
    var ids = arrayColumn(data, fkName).filter(function (el) { return el != null; });
    
    for(var i = 0; i < data.length; i++) this.initFields(data[i],fields);
    
    if(!ids.length) return of(data);
    
    return this.getAll(entityName, ids).pipe(
      map(
        response => {
          if(!response.length) return data;
          for(var i = 0; i < data.length; i++){
            for(var j = 0; j < response.length; j++){
              if(data[i][fkName] == response[j]["id"]) {
                this.assignFields(data[i],response[j],fields,join)
                break;
              }
            }
          }
          return data;
        }
      )
    );  
  }

  allConnection( //1
    data: { [index: string]: any }[], 
    fkName: string,
    entityName: string, 
    fieldName: string, 
    fields: { [index: string]: any } | string[],
    join: string = ", ",
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Similar a getAllConnection pero utiliza un "fieldName", en vez del "id" para realizar la consulta
     */
    if(!data.length) return of([]);
    var ids = arrayColumn(data, fkName).filter(function (el) { return el != null; });
    
    for(var i = 0; i < data.length; i++) this.initFields(data[i],fields);
    
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
                this.assignFields(data[i],response[j],fields,join)
                break;
              }
            }
          }
          return data;
        }
      )
    );  
  }
  
  postAllConnection(
    data: { [index: string]: any }[], 
    method:string,
    fieldNameData: string,
    fieldNameResponse: string, 
    entityName: string, 
    fields: { [index: string]: any },
    join: string = ", "
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta de relaciones directas para metodos no habituales
     * Procedimiento similar a getAllConnection
     * Define un array de identificadores "ids" a partir de los parametros "data[fieldNameData]"
     * Consulta todos los campos del parametro "entityName" utilizando "ids" y parametro "method" para obtener "response"
     * Recorre "data" y "response", compara "data[i][fieldNameData]" con "response[j][fieldNameResponse]" y realiza una asociacion
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     * En la medida de lo posible evitar el uso de este metodo ya que no utiliza storage
     */

    if(!data.length) return of([]);
    var ids = arrayColumn(data, fieldNameData).filter(function (el) { return el != null; });
    if(!ids.length) return of(data);
    return this._post(method,entityName,ids).pipe(
      map(
        response => {
          return this.assignResponse(data,response,fieldNameData,fieldNameResponse,fields,join);
        }
      )
    );  
  }

  assignResponse(
    data: { [index: string]: any }[], 
    response: { [index: string]: any }[], 
    fieldNameData: string,
    fieldNameResponse: string, 
    fields: { [index: string]: any }, 
    join: string = ", "
  ){
    /**
     * Utilizando la referencia asigna respuesta a los datos de origen
     */
    if(!response.length) return data;
    for(var i = 0; i < data.length; i++){
      for(var f in fields){
        if(fields.hasOwnProperty(f)) data[i][f] = null; //inicializar en null
      }

      for(var j = 0; j < response.length; j++){
        if(data[i][fieldNameData] == response[j][fieldNameResponse]) {
          this.assignFields(data[i],response[j],fields,join)
          break;
        }
      }
    }
    return data;
  }
  
  getAllConnectionUm(
    data: { [index: string]: any }[], 
    fieldName: string = "id", //se obtiene el conjunto de identificadores data[fieldName], habitualmente fieldName es id
    fkName: string, //se asocia el conjunto de identificadores a fkName (fk de entityName) 
    entityName: string, 
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta relaciones um de un conjunto de datos
     * Define un conjunto de identificadores "ids", filtrando del parametro "data" el campo "fieldName"
     * Consulta todos los campos del parametro "entityName" utilizando el parametro "fkName" "(fkName = ids)"
     * Recorre "data" y "response", compara "data[i][fkName]" con "response[j][id]" y realiza un push de cada coincidencia
     * los elementos coincidentes se almacenan en data[i][fkName+"_"]
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

  selectConnectionUm(
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
     * Siempre que se pueda utilizar el metodo getAllConnectionUm,
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

  getConnection(
    data: { [index: string]: any }, 
    fkName: string, 
    entityName: string, 
    fields: { [index: string]: any },
    join:string=", "
  ): Observable<{ [index: string]: any }>{
    /**
     * Consulta un solo elemento del parametro "entityName" utilizando los parametros "data[fkName]" para obtener "response" 
     * Efectua una asociacion 
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     */
    if(!data[fkName]){
      for(var f in fields) data[f] = null;
      return of(data);
    }
    return this.get(entityName, data[fkName]).pipe(
      map(
        response => {
          if(!response) return data;
          this.assignFields(data,response,fields,join)
          return data;
        }
      )
    );  
  }

  getConnectionUm(
    data: { [index: string]: any }, 
    fkName: string, 
    entityName: string, 
    fields: { [index: string]: any },
    join:string=", "
  ): Observable<{ [index: string]: any }>{
    /**
     * Consulta un solo elemento del parametro "entityName" utilizando los parametros "data[fkName]" para obtener "response" 
     * Efectua una asociacion 
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     */
    if(!data[fkName]){
      for(var f in fields) data[f] = null;
      return of(data);
    }
    return this.get(entityName, data[fkName]).pipe(
      map(
        response => {
          if(!response) return data;
          this.assignFields(data,response,fields,join)
          return data;
        }
      )
    );  
  }

  getConnectionObj(
    data: { [index: string]: any },
    id: string,
    idResponse: string, 
    fkName: string, 
    entityName: string, 
    fields: { [index: string]: any },
    join:string=", "
  ): Observable<{ [index: string]: { [index: string]: any } }>{
    /**
     * Similar a getConnection pero utiliza una estructura de datos diferente de la forma
     * data["alumno"] = {id:"value",activo:"value"} 
     * data["per"] = {id:"value",activo:"value"}
     */
    data[idResponse] = null;
    if(!data[id][fkName]) return of(data);

    return this.get(entityName, data[id][fkName]).pipe(
      map(
        response => {
          if(!response) return data;
          this.assignFieldsObj(data,idResponse,response,fields,join)
          return data;
        }
      )
    );  
  }

  selectConnection(
    data: { [index: string]: any }[], 
    fieldName: string, 
    entityName: string, 
    fields: { [index: string]: string } //no deben ser funciones de agregacion
  ): Observable<{ [index: string]: any }[]>{
    /**
     * @todo faltaria agregar un fieldName y no utilizar siempre el id
     * Define un conjunto de identificadores "ids".
     * Para definir "ids", recorre el parametro "data y define un array con filtrando el parametro "fieldName"
     * Realiza una consulta avanzada de la entidad identificada con el parametro "entityName"
     * Los campos de la consulta avanzada se definen en el parametro "fields"
     * Recorre "data" y "response", compara "data[i][fieldName]" con "response[j][id]" y realiza una asociacion
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * A diferencia de otros metodos "nombre_field" no puede ser un array, debe ser un campo reconocible por la consulta avanzada
     * En la medida de lo posible evitar el uso de este metodo ya que no almacena cache
     */
    var ids = arrayColumn(data, fieldName).filter(function (el) { return el != null; });
    var display = new Display();
    var fields_ = fastClone(fields); //auxiliar de fields para incluir el id
    if(!fields_.hasOwnProperty("id")) fields_["id"]="id"; //siempre debe existir el id para comparar el resultado
    display.setFieldsArray(Object.values(fields_));
    display.addCondition(["id","=",ids]);
    return this._post("advanced",entityName, display).pipe(
      map(
        response => {
          for(var i = 0; i < data.length; i++){
            for(var f in fields){
              if(fields.hasOwnProperty(f)) data[i][f] = null; //inicializar en null
            }
            for(var j = 0; j < response.length; j++){
              if(data[i][fieldName] == response[j]["id"]) {
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
    for(var i = 0; i < data.length; i++) this.initFields(data[i],fields);
    if(!ids.length) return of(data);
    var display = new Display();
    display.setSize(0);
    display.setFields(fields);
    display.setGroupArray([fieldName]);
    display.addCondition([fieldName,"=",ids]);
    return this._post("advanced",entityName, display).pipe(
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
