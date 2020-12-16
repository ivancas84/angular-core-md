import { Injectable } from '@angular/core';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { arrayUnique } from '@function/array-unique';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataDefinitionService } from './data-definition.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionToolService extends DataDefinitionService{

  getAllColumnData(
    data: { [index: string]: any }[], 
    fieldName: string, 
    entityName: string, 
    fields: { [index: string]: string }
  ): Observable<{ [index: string]: any }[]>{
    var ids = arrayColumn(data, fieldName);
    return this.getAll(entityName, ids).pipe(
      map(
        response => {
          for(var i = 0; i < data.length; i++){
            for(var j = 0; j < response.length; j++){
              if(data[i][fieldName] == response[j]["id"]) {
                for(var f in fields){
                  if(fields.hasOwnProperty(f)) data[i][f] = response[j][fields[f]];
                }
                continue;
              }
            }
          }
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
    var ids = arrayColumn(data, fieldName);
    var display = new Display();
    if(!fields.hasOwnProperty("id")) fields["id"]="id"; //siempre debe existir el id para comparar el resultado
    display.setFields(Object.values(fields));
    display.addCondition(["id","=",ids]);
    return this.post("advanced",entityName, display).pipe(
      map(
        response => {
          for(var i = 0; i < data.length; i++){
            for(var j = 0; j < response.length; j++){
              if(data[i][fieldName] == response[j]["id"]) {
                for(var f in fields){
                  if(fields.hasOwnProperty(f)) data[i][f] = response[j][fields[f]];
                }
                continue;
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
  ): Observable<{ [index: string]: any }[]>{
    var ids = arrayColumn(data, "id");
    var display = new Display();
    display.setFields(fields);
    display.setGroup([fieldName]);
    display.addCondition([fieldName,"=",ids]);
    return this.post("advanced",entityName, display).pipe(
      map(
        response => {
          for(var i = 0; i < data.length; i++){
            for(var j = 0; j < response.length; j++){
              if(data[i]["id"] == response[j][fieldName]) {
                for(var f in fieldsResponse){
                  if(fieldsResponse.hasOwnProperty(f)) data[i][f] = response[j][fieldsResponse[f]];
                }
                continue;
              }
            }
          }
          return data;
        }
      )
    );  
  }
}
