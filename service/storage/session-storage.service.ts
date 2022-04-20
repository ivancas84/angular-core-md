import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class SessionStorageService extends StorageService {


  override getStorage(): any {
    return sessionStorage;
  }

}
