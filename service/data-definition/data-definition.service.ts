import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

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

  isSync(key, sync): boolean { return (!sync || !(key in sync) || sync[key]) ? true : false; }

  all (entity: string, display: Display = null): Observable<any> {
    let key = entity + ".all" + JSON.stringify(display.describe());
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_URL + entity + '/all'
    return this.http.post<any>(url, display.describe(), HTTP_OPTIONS).pipe(
      tap(
        rows => {
          this.storage.setItem(key, rows);
  
          for(let i = 0; i < rows.length; i++){
            let ddi: DataDefinition = this.loader.get(entity);
            ddi.storage(rows[i]);
          }
        }
      )      
    );
  }

  count (entity: string, display: Display = null): Observable<any> {
    let key = entity + ".count" + JSON.stringify(display.describe());
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_URL + entity + '/count'

    return this.http.post<any>(url, display.describe(), HTTP_OPTIONS).pipe(
      tap( res => this.storage.setItem(key, res) )
    );
  }

  _getAll(entity: string, ids: Array<string | number>): Observable<any> {
    /**
     * Metodo complementario para buscar a traves de un array de ids
     */
    if(!ids.length) return of([]);

    let url: string = API_URL + entity + '/get_all';
    return this.http.post<any>(url, ids, HTTP_OPTIONS);
  }

  getAll (entity: string, ids: Array<string | number>): Observable<any> { 
    /**
     * Recibe una lista de ids, y retorna sus datos en el mismo orden que se reciben los ids
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

    return this._getAll(entity, searchIds).pipe(
      map(
        rows_ => {
        rows_.forEach(element => {
          let ddi: DataDefinition = this.loader.get(entity);
          ddi.storage(element);
          let i_string: string = String(element.id);
          let i_int: number = parseInt(i_string);
          let j: string | number = ids.indexOf(i_string);
          if(j == -1){ j = ids.indexOf(i_int); } //BUG: chequear por ambos tipos
          rows[j] = element;
        })
        return rows;
      }
    ))
  }
  
  get (entity: string, id: string|number): Observable<any> {
    if(!id) throw("id es nulo");
    return this.getAll(entity, [id]).pipe(
      map(rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        if(rows.length == 0) throw("La consulta no retorno registro");
        return rows[0];
      })
    )
  }

  getOrNull (entity: string, id: string|number): Observable<any>  {
    if(!id) return of(null);

    return this.getAll(entity, [id]).pipe(
      mergeMap(
        rows => {
          if(rows.length > 1) throw("La consulta retorno mas de un registro");
          return (rows.length != 1) ? of(null) : of(rows[0]);
        }
      )
    );
  }

  ids (entity: string, display: Display = null): Observable<any> {
    let key = entity + ".ids" + JSON.stringify(display.describe());
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_URL + entity + '/ids'
    return this.http.post<any>(url, display.describe(), HTTP_OPTIONS).pipe(
      map(
        ids => {
          this.storage.setItem(key, ids);
          return ids;
        }
      )
    );
  }

  idOrNull (entity: string,  display: Display): Observable<any> {
    return this.ids(entity, display).pipe(
      map(rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        if(rows.length == 0) return null;
        return rows[0];
      })
    )
  }

  label (entity: string, id: string | number): string {
    /**
     * Etiqueta de identificacion
     * Los datos a utilizar deben estar en el storage
     * Si no se esta seguro si los datos se encuentran en el storage, se puede utilizar labelGet
     */
    return this.loader.get(entity).label(id);
  }

  labelGet (entity: string, id: string | number): Observable<string> {
    /**
     * Etiqueta de identificacion
     * Este metodo tiene por objeto obtener todos los datos necesario de la entidad para definir el label y almacenarlos en el storage.
     * Debe sobrescribirse este metodo si la entidad necesita consultas adicionales para definir el label
     */
    return this.get(entity, id).pipe(
      map( () => { return this.label(entity, id)} )
    )
  }

  uniqueOrNull(entity: string, params:any): Observable<any> {
    if(!params) return of(null);
    let key = entity + ".unique" + JSON.stringify(params);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_URL + entity + '/unique'
    return this.http.post<any>(url, params, HTTP_OPTIONS).pipe(
      map(
        row => {
          this.storage.setItem(key, row);
          let ddi: DataDefinition = this.loader.get(entity);
          ddi.storage(row);
          return row;
        }
      )
    );
  }

  persist(entity: string, data: any){
    /**
     * Datos a ser procesados.
     * Retorna array con los ids persistidos.
     */
    let url = API_URL + entity + '/persist'

    return this.http.post<any>(url, JSON.stringify(data), HTTP_OPTIONS).pipe(
      map(
        response => {
          console.log(response);
          //this.message.add("Se efectuado un registro de datos");
          return response;
        }
      )
    )
  }

  data (entity: string, data: any = null): Observable<any> {
    var jsonParams = JSON.stringify(data);
    let key = entity + ".data" + jsonParams;
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));


    let url = API_URL + entity + '/data'
    return this.http.post<any>(url, jsonParams, HTTP_OPTIONS).pipe(
      map(
        data => {
          this.storage.setItem(key, data)
          return data;
        }
      )
    );
  }

  public upload(data: FormData, type: string = "file") {
    /**
     * @param type: Permite clasificar el procesamiento que debe darse a un archivo. 
     *   "File" es el procesamiento por defecto.
     */
    let url = API_URL + type + '/upload';

    return this.http.post<any>(url, data);
  }
}
