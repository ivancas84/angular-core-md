import { Injectable } from '@angular/core';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { fastClone } from '@function/fast-clone';
import { recursiveData } from '@function/recursive-data';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataDefinitionService } from './data-definition.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionToolService extends DataDefinitionService{
  
  protected initFields(
    data: { [index: string]: any },
    fields:{ [index: string]: string },
  ){
    for(var f in fields){
      if(fields.hasOwnProperty(f)) data[f] = null; //inicializar en null
    }
  }

  protected assignFields(
    data: { [index: string]: any }, 
    response: { [index: string]: any }, 
    fields:{ [index: string]: string }, 
    join: string
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
          data[f] = d.join(join);
        } else {
          data[f] = response[fields[f]];
        }
      }
    }
  }

  getTree(
    tree:string[], //arbol ["identificador1","identificador2",...]
    data: { [index: string]: any } | { [index: string]: any }[], //datos
    method:string, //nombre del metodo a ejecutar
    params:any = null //objeto con parametros de method 
  ){
    /**
     * Recorrer arbol y ejecutar metodo indicado
     * Utiliza funcion externa "recursiveData" para obtener la hoja indicada del parametro "tree" en "data"
     * Ejecuta metodo indicado en parametro "method" con parametros indicados en parametro "params"
     * Los valores se asignan al resultado de "recursiveData" y se reflejan en "data" ya que js trabaja por referencia
     */
    switch(method){
      case "getAllColumnDataUm":
        return this.getAllColumnDataUm(recursiveData(tree, data),params["fkName"],params["entityName"]).pipe(map(
          () => {return data;} //se vuelve a retornar data, gracias a la referencia js tendran los valores reasignados en el metodo
        ));
      case "getPostAllColumnData":
        var join = (params.hasOwnProperty("join")) ? params["join"] : ", "; 
        return this.getPostAllColumnData(
          recursiveData(tree, data),
          params["method"],
          params["fieldNameData"],
          params["fieldNameResponse"],
          params["entityName"],
          params["fields"],
          join
        ).pipe(map(
          () => {return data;} //se vuelve a retornar data, gracias a la referencia js tendran los valores reasignados en el metodo
        ))
      case "advancedColumnDataGroup":
        var join = (params.hasOwnProperty("join")) ? params["join"] : ", "; 
        return this.advancedColumnDataGroup(
          recursiveData(tree, data),
          params["fieldName"],
          params["entityName"],
          params["fields"],
          params["fieldsResponse"],
          join
        ).pipe(map(
          () => {return data;} //se vuelve a retornar data, gracias a la referencia js tendran los valores reasignados en el metodo
        ))
    }
  }

  getAllColumnData(
    data: { [index: string]: any }[], 
    fkName: string, 
    entityName: string, 
    fields: { [index: string]: any },
    join: string = ", "
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta de relaciones directas
     * Define un array de identificadores "ids" a partir de los parametros "data[fkName]"
     * Consulta todos los campos del parametro "entityName" utilizando "ids" para obtener "response"
     * Recorre "data" y "response", compara "data[i][fkName]" con "response[j][id]" y realiza una asociacion
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     */
    if(!data.length) return of([]);
    var ids = arrayColumn(data, fkName).filter(function (el) { return el != null; });
    if(!ids.length) {
      for(var i = 0; i < data.length; i++) this.initFields(data[i],fields);
      return of(data);
    }
    return this.getAll(entityName, ids).pipe(
      map(
        response => {
          if(!response.length) return data;
          for(var i = 0; i < data.length; i++){
            this.initFields(data[i],fields);
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
    
  
  getPostAllColumnData(
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
     * Procedimiento similar a getAllColumnData
     * Define un array de identificadores "ids" a partir de los parametros "data[fkName]"
     * Consulta todos los campos del parametro "entityName" utilizando "ids" y parametro "method" para obtener "response"
     * Recorre "data" y "response", compara "data[i][fieldNameData]" con "response[j][fieldNameResponse]" y realiza una asociacion
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     */
    if(!data.length) return of([]);
    var ids = arrayColumn(data, fieldNameData).filter(function (el) { return el != null; });
    if(!ids.length) return of(data);
    return this.post(method,entityName,ids).pipe(
      map(
        response => {
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
      )
    );  
  }
  
  getAllColumnDataUm(
    data: { [index: string]: any }[], 
    fkName: string, //fkName para entityName
    entityName: string, 
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta relaciones um de un conjunto de datos
     * Define un conjunto de identificadores "ids", filtrando del parametro "data" el campo "id"
     * Consulta todos los campos del parametro "entityName" utilizando el parametro "fkName" "(fkName = ids)"
     * Recorre "data" y "response", compara "data[i][fkName]" con "response[j][id]" y realiza un push de cada coincidencia
     * los elementos coincidentes se almacenan en data[i][fkName+"_"]
     * Al no ser una "asociacion" no hace falta filtrar datos, 
     * directamente se almacena todo el cada resultado 
     * como elemento de un array
     */
    if(!data.length) return of([]);
    var ids = arrayColumn(data, "id");
    if(!ids.length) return of(data);
    var display = new Display();
    display.setSize(0);
    display.addParam(fkName,ids);
    return this.all(entityName, display).pipe(
      map(
        response => {
          if(!response.length) return data;
          for(var i = 0; i < data.length; i++) data[i]["_"+entityName] = []; //inicializar
          for(var j = 0; j < response.length; j++){
            for(var i = 0; i < data.length; i++) { 
              if(response[j][fkName] == data[i]["id"]) 
                data[i]["_"+entityName].push(response[j]);
            }
          }
          return data;
        }
      )
    );  
  }

  getColumnData(
    data: { [index: string]: any }[], 
    fieldName: string, 
    entityName: string, 
    fields: { [index: string]: any },
    join:string=", "
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta un solo elemento del parametro "entityName" utilizando los parametros "data[fieldName]" para obtener "response" 
     * Efectua una asociacion 
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * Si el "nombre_field" es un array, realiza una concatenacion de los campos utilizando parametro "join"
     */
    if(!data[fieldName]){
      for(var f in fields) data[f] = null;
      return of(data);
    }
    return this.get(entityName, data[fieldName]).pipe(
      map(
        response => {
          if(!response) return data;
          this.assignFields(data,response,fields,join)
          return data;
        }
      )
    );  
  }

  
  advancedColumnData(
    data: { [index: string]: any }[], 
    fieldName: string, 
    entityName: string, 
    fields: { [index: string]: string } //no deben ser funciones de agregacion
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Define un conjunto de identificadores "ids".
     * Para definir "ids", recorre el parametro "data y define un array con filtrando el parametro "fieldName"
     * Realiza una consulta avanzada de la entidad identificada con el parametro "entityName"
     * Los campos de la consulta avanzada se definen en el parametro "fields"
     * Recorre "data" y "response", compara "data[i][fieldName]" con "response[j][id]" y realiza una asociacion
     * La asociacion se realiza mediante parametro "fields", objeto compuesto por "{nombre_asociacion:nombre_field}"
     * A diferencia de otros metodos "nombre_field" no puede ser un array, debe ser un campo reconocible por la consulta avanzada
     */
    var ids = arrayColumn(data, fieldName).filter(function (el) { return el != null; });
    var display = new Display();
    var fields_ = fastClone(fields); //auxiliar de fields para incluir el id
    if(!fields_.hasOwnProperty("id")) fields_["id"]="id"; //siempre debe existir el id para comparar el resultado
    display.setFields(Object.values(fields_));
    display.addCondition(["id","=",ids]);
    return this.post("advanced",entityName, display).pipe(
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

  advancedColumnDataGroup(
    data: { [index: string]: any }[], 
    fieldName: string, 
    entityName: string, 
    fields: string[], //utilizar solo funciones de agregacion
    fieldsResponse: { [index: string]: string }, //el resultado de las funciones de agregacion reciben un nombre diferente al atributo fields 
    join: string = ", " 
  ): Observable<{ [index: string]: any }[]>{
    /**
     * Consulta avanzada de relaciones directas
     * Define "ids" filtra el campo "id" del parametro "data"
     * Define "display.fields", asigna el parametro fields
     * Define "display.group", asigna el parametro fieldName
     * Define "display.condition", utiliza el parametro "fieldName" y el array ids
     * Consulta entidad indicada en parametro "entityName" para obtener "response"
     * Realiza asociacion entre "data" y "response"
     * Si data[i]["id"] == response[j][fieldName] almacena en data los campos indicados en parametro "fieldsResponse"
     * "fieldsResponse" es un objeto de la forma {nombre_identificacion:nombre_field}
     * si "nombre_field" es un array realiza un join utilizando el parametro "join"
     * 
     */

    var ids = arrayColumn(data, "id")
    if(!ids.length) {
      for(var i = 0; i < data.length; i++) this.initFields(data[i],fieldsResponse);
      return of(data);
    } 
    var display = new Display();
    display.setSize(0);
    display.setFields(fields);
    display.setGroup([fieldName]);
    display.addCondition([fieldName,"=",ids]);
    return this.post("advanced",entityName, display).pipe(
      map(
        response => {
          for(var i = 0; i < data.length; i++){
            this.initFields(data[i],fieldsResponse);
            for(var j = 0; j < response.length; j++){
              if(data[i]["id"] == response[j][fieldName]) {
                this.assignFields(data[i],response[j],fieldsResponse,join)
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
