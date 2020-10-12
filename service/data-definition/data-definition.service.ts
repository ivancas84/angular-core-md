import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, mergeMap, share, first, switchMap } from 'rxjs/operators';

import { API_URL, HTTP_OPTIONS } from '../../../app.config';
import { SessionStorageService } from '../storage/session-storage.service';
import { Display } from '../../class/display';
import { DataDefinition } from '../../class/data-definition';
import { DataDefinitionLoaderService } from '../../../service/data-definition-loader.service';
import { MessageService } from '../message/message.service';
import { ParserService } from '../parser/parser.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionService {

  constructor(
    protected http: HttpClient, 
    protected storage: SessionStorageService, 
    protected loader: DataDefinitionLoaderService,
    protected message: MessageService, 
    protected parser: ParserService,
  ) { }

  
  _post(api: string, entity: string, data: any = null):  Observable<any> {
    var jsonParams = (data instanceof Display) ? data.describe() : data;
    let url_ = API_URL + entity + '/'+api;
    return this.http.post<any>(url_, jsonParams, HTTP_OPTIONS).pipe(first());
  }

  post(api: string, entity: string, data: any = null):  Observable<any> {    
    var jsonParams = (data instanceof Display) ? data.describe() : data;
    let key = entity + "." + api + JSON.stringify(jsonParams);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key))

    return this._post(api, entity, data).pipe(tap(
      response => this.storage.setItem(key, response)
    ));
  }

  all (entity: string, display: Display = null): Observable<any> {
    return this.post("ids", entity, display).pipe(
      switchMap(
        ids => {
          return this.getAll(entity, ids);
        }
      )
    )
  }

  unique (entity: string, params: any): Observable<any> {
    /**
     * para evitar obtener desde el servidor el json del valor de una entidad y sus relaciones pudiendose evitar, 
     * se opto por obtener solo el id
     */
    return this.post("unique_id", entity, params).pipe(
      switchMap(
        id => {
          return this.get(entity, id);
        }
      )
    )
  }

  getAll (entity: string, ids: Array<string | number>): Observable<any> { 
    /**
     * Recibe una lista de ids, y retorna sus datos en el mismo orden que se reciben los ids
     * Realiza un storage de los elementos recibidos
     * Procedimiento:
     *   Se define un array del tamanio del array de ids recibido
     *   Se define un nuevo array "rows" con los valores a retornar
     *   Se busca la coincidencia del id en el storage, y se asigna en la posicion correspondiente de rows
     *   Si no existe coincidencia se define un nuevo array "searchIds" con los ids a buscar en el servidor
     *   Se realiza una consulta al servidor con searchIds y se obtiene un "rows_" auxiliar
     *   Se recorre el resultado de la consulta comparando el id de "rows_" con el id de ids para obtener la posicion corresopndiente
     *   Se carga el resultado de rows_ en la posicion correspondiente
     */
    let rows: Array<{ [index: string]: boolean|string|number }> = new Array(ids.length);

    let searchIds: Array<string | number> = new Array();

    for(let i = 0; i < ids.length; i++) {
      let data: { [index: string]: boolean|string|number }  = this.storage.getItem(entity + ids[i]);

      rows[i] = data;
      if(!data) searchIds.push(ids[i]);
    }

    if(!searchIds.length) return of(rows);

    return this._post("get_all", entity, searchIds).pipe(
      map(
        rows_ => {
          let ddi: DataDefinition = this.loader.get(entity);

          rows_.forEach(element => {
            ddi.storage(element);
            let i_string: string = String(element.id);
            let i_int: number = parseInt(i_string);
            let j: string | number = ids.indexOf(i_string);
            if(j == -1){ j = ids.indexOf(i_int); } //BUG: chequear por ambos tipos
            rows[j] = element;
          })
          return rows;
        }
      )
    )
  }
  
  get (entity: string, id: string|number): Observable<any> {
    if(!id) throw("id es nulo");
    return this.getAll(entity, [id]).pipe(
      map(rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        return (rows.length != 1) ? null : rows[0];
      })
    )
  }

  id (entity: string,  display: Display): Observable<any> {
    return this.post("ids", entity, display).pipe(
      map(rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        if(rows.length == 0) return null;
        return rows[0];
      })
    )
  }

  upload(entity: string = "file", data: FormData) {
    /**
     * @param entity: Permite clasificar el procesamiento que debe darse a un archivo. 
     *   "File" es el procesamiento por defecto.
     *   Otros tipos de procesamiento pueden ser "Image", o si es un procesamiento particular algun nombre personalizado, por ejemplo "Info"
     */
    let url = API_URL + entity + '/upload';
    return this.http.post<any>(url, data).pipe(first());
  }

  label (entity: string, id: string | number): string {
    /**
     * DEPRECATED
     * Etiqueta de identificacion
     * Los datos a utilizar deben estar en el storage
     * Si no se esta seguro si los datos se encuentran en el storage, se puede utilizar labelGet
     */
    return this.loader.get(entity).label(id);
  }

  labelGet (entity: string, id: string | number): Observable<string> {
    /**
     * DEPRECATED
     * Etiqueta de identificacion
     * Este metodo tiene por objeto obtener todos los datos necesario de la entidad para definir el label y almacenarlos en el storage.
     * Debe sobrescribirse este metodo si la entidad necesita consultas adicionales para definir el label
     */
    return this.get(entity, id).pipe(
      map( () => { return this.label(entity, id)} )
    )
  }

}
