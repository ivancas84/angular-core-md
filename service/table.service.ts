import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, first, switchMap } from 'rxjs/operators';
import { API_URL} from '../../../app.config';
import { Display } from '@class/display';
import { CookieService } from 'ngx-cookie-service';
import { arrayClean } from '@function/array-clean';
import { arrayUnique } from '@function/array-unique';
import { DataDefinitionStorageService } from './data-definition-storage-service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { LocalStorageService } from '@service/storage/local-storage.service';

/**
 * Metodos generales de administracion de Tablas
 */
@Injectable({
  providedIn: 'root'
})
export class TableService {


}
