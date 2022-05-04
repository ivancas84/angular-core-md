import { Component } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { Location } from '@angular/common';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsDirty } from '@function/mark-all-as-dirty';

@Component({
  selector: 'core-upload',
  template: '',
})
export abstract class UploadComponent {
  /**
   * Comportamiento basico para subir archivos para ser procesados.
   * A través del atributo entityName se define el controlador de procesamiento del archivo
   * La idea es subir un archivo que sera procesado en un controlador, no se debe confundir con el Input Upload cuyo proposito es subir el archivo y asignarlo como valor fk de una entidad
   */

  uploadForm: FormGroup = this.fb.group( //formulario principal
    {
      file: [null, {
        validators: [Validators.required],
      }],
    }
  );


  readonly entityName!: string;
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
     * Los objetos FormData le permiten compilar un conjunto de pares clave/valor para enviar mediante XMLHttpRequest. 
     * Están destinados principalmente para el envío de los datos del formulario, pero se pueden utilizar de forma independiente con el fin de transmitir los datos tecleados. 
     * Los datos transmitidos estarán en el mismo formato que usa el método submit() del formulario
     * para enviar los datos si el tipo de codificación del formulario se establece en "multipart/form-data".
     * 
     * @return FormData
     */

    const formData = new FormData();
    const file = this.file!.value._files[0];

    formData.append("file", file);
    return formData;
  }

  upload(): void {
    /**
     * subida de archivo
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array con la informacion del archivo)"
     */    
    var s = this.dd.upload(this.entityName, this.formData()).subscribe(
      (res) => {
        this.submitted(res);        
      },
      (err) => {
        this.isSubmitted = false;  
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: err.error}
        });
      }
    );
    this.subscriptions.add(s);
  }

  submitted(response: any){
    this.response = response;
    this.snackBar.open("Archivo subido", "X");
  }

  reset(): void{
    this.file!.setValue(null);
  }
  
  onSubmit(): void {
    this.isSubmitted = true;
    
    if (!this.uploadForm.valid) {
      this.cancelSubmit();
    } else {
      this.upload();
    }
  }

  cancelSubmit(){
    markAllAsDirty(this.uploadForm);
    logValidationErrors(this.uploadForm);
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message: "El formulario posee errores."}
    });
    this.isSubmitted = false;
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }
}
