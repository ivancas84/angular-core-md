import { OnInit, Component } from '@angular/core';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { FormArrayConfig, FormGroupConfig } from '@class/reactive-form-config';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StructureComponent } from '@component/structure/structure.component';
import { FieldWidthOptions } from '@class/field-width-options';
import { InputTextConfig } from '@component/input-text/input-text.component';
import { DialogConfirmComponent } from '@component/dialog-confirm/dialog-confirm.component';
import { getControlName } from '@function/get-control-name';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';

/**
 * Metodos generales para administrar un array de datos
 */
@Component({
  selector: 'core-array2',
  template: '',
})
export abstract class Array2Component extends StructureComponent implements OnInit {

  entityName!: string
  
    /**
   * Estructura principal para administrar un array de elementos
   */
     override control: FormArray = this.fb.array([]);

     length!: number; //longitud total de los datos a mostrar
     
     load: boolean = false; //Atributo auxiliar necesario para visualizar la barra de carga
   
     /**
      * Por una cuestión de facilidad, los atributos y métodos relativos a busque-
      * da se declaran en ArrayComponent, pero no deberían estar. ArrayComponent
      * debería ser más simple
      */
   
  
   
     initLength(): Observable<any> {
       /**
        * Si no se desea procesar la longitud, retornar of(null)
        */
       return this.dd.post("count", this.entityName, this.display$.value).pipe(
         catchError(
           (error) => {
             this.dialog.open(DialogAlertComponent, {
               data: {title: "Error", message: error.error}
             })
             this.length = 0
             return of(null)
           }
         ),    
         map(
           count => {
             return this.length = count; 
           }
         )
       );
     }
     
    loadDisplay(){
       /**
        * Se define un load independiente para el display, es util para reasignar
        * valores directamente al display y reinicializar por ejemplo al limpiar
        * o resetear el formulario
        */
      this.loadDisplay$ = this.display$.pipe(
        switchMap(
          () => {
            this.load = false
            return this.initLength();
          }
        ),
        switchMap(
          () =>   (this.length === 0) ? of([]) : this.initData()
        ),
        map(
          data => {
            this.setData(data)
            return this.load = true;
          }
        ),
      )
    }
   
    getStorageValues(): any {
      return this.control.getRawValue()
    }
   
    setData(data: any[]){
      if (!this.length && data.length) this.length = data.length
      this.control.clear();
      for(var i = 0; i <data.length; i++) this.control.push(this.formGroup());
      this.control.patchValue(data)
    }
   
    override initData(): Observable<any>{
      return this.dd.post("ids", this.entityName, this.display$.value).pipe(
        switchMap(
          ids => this.dd.entityFieldsGetAll(this.entityName, ids, Object.keys(this.formGroup().controls))
        )
      )
    }

    abstract formGroup(): FormGroup;
}
