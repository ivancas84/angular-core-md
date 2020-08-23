import { Component } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { Location } from '@angular/common';

@Component({
  selector: 'core-upload',
  template: '',
})
export abstract class UploadComponent {
  /**
   * Comportamiento basico para subir archivos
   * A través del atributo entityName se define el controlador de procesamiento del archivo idea es subir un archivo que sera procesado en un controlador
   */

  uploadForm: FormGroup = this.fb.group(
    {
      file: [null, {
        validators: [Validators.required],
      }],
    }
  );
  /**
   * Formulario principal
   */

  readonly entityName: string;
  /**
   * La entidad hace referencia principalmente al controlador que procesara el archivo
   */
  
  isSubmitted: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton aceptar
   */

  formData: FormData;
  /**
   * Objeto con el archivo que sera enviado al servidor
   */

  protected subscriptions = new Subscription();
   
  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService, 
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected location: Location, 
  ) {}

  get file() { return this.uploadForm.get('file')}

  back() { this.location.back(); }

  upload(): void {
    /**
     * subida de archivo
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array con la informacion del archivo)"
     */

    const file = this.file.value._files[0];
    const formData = new FormData();
    formData.append("file", file);
    /**
     * El controlador procesa un unico archivo identificado como file
     * No confundir con el entityName
     **/

    this.dd.upload(this.entityName, formData).subscribe(
      (res) => {
        console.log(res);
        this.snackBar.open("Archivo subido", "X");
      },
      (err) => {  
        console.log(err);

        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: err.error}
        });
      }
    );
  }

  reset(): void{
    this.file.setValue(null);
  }
  
  onSubmit(): void {
    this.isSubmitted = true;
    
    if (!this.uploadForm.valid) {
      const dialogRef = this.dialog.open(DialogAlertComponent, {
        data: {title: "Error", message: "El formulario posee errores."}
      });
      this.isSubmitted = false;

    } else {
      this.upload();
    }
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }
}
