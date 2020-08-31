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

  protected subscriptions = new Subscription();

  response: any;
   
  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService, 
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected location: Location, 
  ) {}

  get file() { return this.uploadForm.get('file')}

  back() { this.location.back(); }

  formData(): FormData{
    /**
     * Crear FormData
     * Se define un metodo independiente para facilitar la redefinicion
     * 
     * Los objetos FormData le permiten compilar un conjunto de pares clave/valor para enviar mediante XMLHttpRequest. 
     * Están destinados principalmente para el envío de los datos del formulario, 
     * pero se pueden utilizar de forma independiente con el fin de transmitir los datos tecleados. 
     * Los datos transmitidos estarán en el mismo formato que usa el método submit() del formulario
     * para enviar los datos si el tipo de codificación del formulario se establece en "multipart/form-data".
     * 
     * @return FormData
     */

    const file = this.file.value._files[0];
    const formData = new FormData();
    formData.append("file", file);
    return formData;
  }

  upload(): void {
    /**
     * subida de archivo
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array con la informacion del archivo)"
     */    
    this.dd.upload(this.entityName, this.formData()).subscribe(
      (res) => {
        this.response = res;
        this.snackBar.open("Archivo subido", "X");
      },
      (err) => {
        this.isSubmitted = false;  
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
