import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormControl } from '@angular/forms';
import { first, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { UPLOAD_URL } from 'app/app.config';
import { fastClone } from '@function/fast-clone';


@Component({
  selector: 'core-download',
  templateUrl: './download.component.html',
  
})
export class DownloadComponent implements OnChanges {
  /**
   * Definir link para descargar archivos
   */
 

  @Input() entityName?: string = "file";
  @Input() id: string;
  file: any;


  constructor(protected dd: DataDefinitionService, protected storage: SessionStorageService) { }

  ngOnChanges(changes: SimpleChanges){
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue ) {
      if(!changes['id'].currentValue) this.file = null;
      else {
        this.dd.get(this.entityName, this.id).pipe(
          map(
            row => {
              if(row) {
                this.file = row;
                this.file["link"] = UPLOAD_URL+this.file.content; 
              } else {
                this.file = null;
              }
            }
          )
        ).subscribe(
          () => {return true;}
        );;
      }
    }
  }
}