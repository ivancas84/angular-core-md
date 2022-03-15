import { Injectable } from '@angular/core';
import { Display } from '@class/display';
import { arrayColumn } from '@function/array-column';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataDefinitionFkAllService } from './data-definition-fk-all.service';
import { DataDefinitionRelInitialize } from './data-definition-rel-initialize.service';
import { DataDefinitionToolService } from './data-definition-tool.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionUmService {
  /**
   * Servicio de inicializacion de campos de una entidad y sus relaciones
   * Los metodos de este servicio retornan un array de resultados de la forma
   *   [{id:"value", activo:true, per-id:"value", per-numero_documento:"value"},...]
   */

  constructor(
    protected dd: DataDefinitionToolService, 
    protected init: DataDefinitionRelInitialize,
    protected fkGetAll: DataDefinitionFkAllService
  ) { }


  public fields(
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
          return this.fkGetAll.getAllFields(entityName,ids,fields)}
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



}
