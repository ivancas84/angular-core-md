import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormControl } from '@angular/forms';
import { first, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { UPLOAD_URL } from 'app/app.config';
import { fastClone } from '@function/fast-clone';


@Component({
  selector: 'core-input-upload',
  templateUrl: './input-upload.component.html',
  
})
export class InputUploadComponent implements OnInit { //2

  @Input() title?: string
  @Input() field: FormControl;
  /**
   * Field correspondiente a la entidad padre con el id del archivo
   */

  @Input() entityName?: string = "file";
  /**
   * Permite seleccionar una alternativa entre diferentes controladores de procesamiento
   * sin necesidad de reimplementar el componente
   */

  fileControl: FormControl = new FormControl();
  
  file: any = null;

  protected subscriptions = new Subscription();

  constructor(protected dd: DataDefinitionService, protected storage: SessionStorageService) { }

  load$: Observable<any>

 ngOnInit(): void {
    this.load$ = this.field.valueChanges.pipe(
      startWith(this.field.value),
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
            if(this.field.enabled) this.fileControl.enable();
          }
          return true;
        }
      )
    );

  }

  @ViewChild('fileSelection') FileSelectInputDialog: ElementRef;

  public OpenAddFilesDialog() {
      const e: HTMLElement = this.FileSelectInputDialog.nativeElement;
      e.click();
  }
  
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      /**
       * El controlador procesa un unico archivo identificado como file, no confundir con el entityName
       */
      this.field.markAsPending();
      this.dd.upload(this.entityName, formData).subscribe(
        (res) => {
          //this.file = fastClone(res.file);
          //this.file["link"]= UPLOAD_URL+this.file["content"]
          this.storage.setItem("file" + res.id, res.file);
          this.field.setValue(res.id);
          this.field.markAsDirty();
          // this.field.setErrors({'incorrect': true});
        },
        (err) => {  
          console.log(err);
        }
      );
    }
  }

}