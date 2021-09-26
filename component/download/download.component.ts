import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { map, startWith, switchMap } from 'rxjs/operators';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { UPLOAD_URL } from 'app/app.config';
import { FormControlConfig } from '@class/reactive-form-config';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

export class DownloadConfig extends FormControlConfig {
  componentId: string = "download"
  entityName?: string = "file";
  
  constructor(attributes: any = {}) {
    super({})
    Object.assign(this, attributes)
  }
}

@Component({
  selector: 'core-download',
  templateUrl: './download.component.html',
  
})
export class DownloadComponent implements OnInit {
  /**
   * Definir link para descargar archivos
   */

  @Input() config: DownloadConfig;
  @Input() control: FormControl;
  file: any;

  constructor(protected dd: DataDefinitionService, protected storage: SessionStorageService) { }


  ngOnInit(){
    this.control.valueChanges.pipe(
      startWith(this.control.value),
      switchMap(
        value => {
          if(!value) return of(null);
          else return this.dd.get(this.config.entityName, value)
        }
      )
    ).subscribe(
      row => {
        if(row) {
          this.file = row;
          this.file["link"] = UPLOAD_URL+this.file.content; 
        } else {
          this.file = null;
        }
      }
    )
  }

}