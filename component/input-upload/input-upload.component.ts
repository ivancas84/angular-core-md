import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { UPLOAD_URL } from 'app/app.config';
import { FormControlConfig } from '@class/reactive-form-config';
import { getControlName } from '@function/get-control-name';
import { titleCase } from '@function/title-case';

export class InputUploadConfig extends FormControlConfig {
  override component: any = InputUploadComponent
  entityName?: string = "file";
  /**
   * entityName hace referencia a la entidad donde se almacenara el archivo
   */
  
  constructor(attributes: any = {}) {
    super()
    Object.assign(this, attributes)
  }
}


@Component({
  selector: 'core-input-upload',
  templateUrl: './input-upload.component.html',
  
})
export class InputUploadComponent implements OnInit { //2

  @Input() config!: InputUploadConfig;
  @Input() control!: FormControl;


  fileControl: FormControl = new FormControl();
  
  file: any = null;

  protected subscriptions = new Subscription();

  constructor(protected dd: DataDefinitionService, protected storage: SessionStorageService) { }

  load$!: Observable<any>

 ngOnInit(): void {
  if(!this.config.label) {
    var n = getControlName(this.control)
    this.config.label = titleCase(n.substring(n.indexOf("-")+1).replace("_"," "))
  }
    this.load$ = this.control.valueChanges.pipe(
      startWith(this.control.value),
      switchMap(
        value => {
          return this.dd.get("file", value)
        }
      ),
      map(
        row => {
          if(row) {
            this.file = row;
            this.file["link"] = UPLOAD_URL+this.file.content; 
            this.fileControl.setValue("");
            this.fileControl.disable();
          } else {
            this.file = null;
            if(this.control.enabled) this.fileControl.enable();
          }
          return true;
        }
      )
    );

  }

  @ViewChild('fileSelection') FileSelectInputDialog!: ElementRef;

  public OpenAddFilesDialog() {
      const e: HTMLElement = this.FileSelectInputDialog.nativeElement;
      e.click();
  }
  
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      /**
       * El controlador procesa un unico archivo identificado como file, no confundir con el entityName
       */
      this.control.markAsPending();
      this.dd.upload(this.config.entityName, formData).subscribe(
        (res) => {
          //this.file = fastClone(res.file);
          //this.file["link"]= UPLOAD_URL+this.file["content"]
          this.storage.setItem("file" + res.id, res.file);
          this.control.setValue(res.id);
          this.control.markAsDirty();
          // this.field.setErrors({'incorrect': true});
        },
        (err) => {  
          console.log(err);
        }
      );
    }
  }

}