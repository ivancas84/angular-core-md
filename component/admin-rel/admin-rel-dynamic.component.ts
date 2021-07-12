import { OnInit, AfterViewInit, Component, Output, EventEmitter } from '@angular/core';
import { AdminRelStructure } from '@class/admin-rel-structure';
import { Display } from '@class/display';
import { AdminComponent } from '@component/admin/admin.component';
import { isEmptyObject } from '@function/is-empty-object.function';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { DataDefinitionFkObjService } from '@service/data-definition/data-definition-fk-obj.service';
import { DataDefinitionUmObjService } from '@service/data-definition/data-definition-um-obj.service';

@Component({
  selector: 'core-admin-rel-dynamic',
  template: '',
})
export abstract class AdminRelDynamicComponent extends AdminComponent implements OnInit, AfterViewInit { //3
/**
 * Especializacion del formulario de administracion 
 * para administrar una entidad y sus relaciones
 */

 constructor(
  protected fb: FormBuilder, 
  protected route: ActivatedRoute, 
  protected router: Router, 
  protected location: Location, 
  protected dd: DataDefinitionToolService, 
  protected validators: ValidatorsService,
  protected storage: SessionStorageService, 
  protected dialog: MatDialog,
  protected snackBar: MatSnackBar,
  protected relFk: DataDefinitionFkObjService,
  protected relUm: DataDefinitionUmObjService
) { 
  super(fb, route, router, location, dd, validators, storage, dialog, snackBar)

}




  structure:AdminRelStructure[];
  persistApi:string = "persist_rel";
  queryApi:string = "unique_rel"
  /**
   * 'unique_rel' permite inicializar en el servidor una entidad y sus relaciones haciendo un cuidadoso analisis de los parametros
   * "unique_rel_um" utiliza unique_rel y lo combina con metodos para inicializar las relaciones um.
   * Ejemplo de identificacion de relaciones um, sea la entidad principal toma: 
   *   cur: curso (toma.curso) fk
   *   cur_com: comision (curso.comision) fk
   *   cur_com-alumno/comision (alumno.comision) um
   * @returns 
   */

   optColumn: any[] = null; //opciones (si es null no se visualiza)

  serverData() { return this.adminForm.value }

  queryData(): Observable<any> {
    switch(this.queryApi){
      case "unique_rel_um": case "unique_rel":  
        return this.relFk.uniqueStructure(this.entityName, this.display$.value, this.structure).pipe(
        switchMap(
          row => {
            return this.relUm.structure(this.entityName, row, this.structure)
          }
        )
      )
      default: return super.queryData();
    }
  }


 

  loadStorage() {
    /**
     * Se incluye una comparacion adicional para inicializar correctamente.
     * Al utilizar *ngIf y asignar varios controls al adminForm no se inicializa correctamente
     * En el caso de que la cantidad de elementos de la estructura no sea igual a la cantidad de controls del formulario 
     * no se inicializa el storage, pero permite utilizar el formulario
     */
    var s = this.adminForm.valueChanges.subscribe (
      formValues => {
        if(Object.keys(this.adminForm.controls).length == this.structure.length)
          this.storage.setItem(this.router.url, formValues);
      },
      error => { 
        this.snackBar.open(JSON.stringify(error), "X"); 
      }
    );
    this.subscriptions.add(s);
  }

  @Output() event: EventEmitter<any> = new EventEmitter();

  switchAction($event:any){ 
    console.log($event)

    /**
     * Acciones de opciones
     * Sobescribir si se necesita utilizar eventos
     * Utilizar $event.action para la accion a ejecutar (corresponde a opt.action)
     * Utilizar $event.data para los datos a utilizar (corresponde a row)
     */  
    switch($event.action){
      case "delete":
        this.delete()
      break;
      default:
        throw new Error("Not Implemented");
    }   
  }

  emitEvent($event){
    console.log($event);
    switch($event.action){
      default:
        this.event.emit($event);
    }
  }
}
