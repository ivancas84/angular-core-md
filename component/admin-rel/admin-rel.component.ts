import { OnInit, AfterViewInit, Component } from '@angular/core';
import { AdminRelStructure } from '@class/admin-rel-structure';
import { AdminComponent } from '@component/admin/admin.component';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'core-admin-rel',
  template: '',
})
export abstract class AdminRelComponent extends AdminComponent implements OnInit, AfterViewInit { //1.1
/**
 * Especializacion del formulario de administracion 
 * para administrar una entidad y sus relaciones
 */

  structure:AdminRelStructure[];
  persistApi:string = "persist_rel";
  queryApi:string = "unique_rel"
  /**
   * 'unique_rel' permite inicializar en el servidor una entidad y sus relaciones haciendo un cuidadoso analisis de los parametros
   * "unique_rel_str" utiliza unique_rel y lo combina con metodos para inicializar las relaciones um.
   * Ejemplo de identificacion de relaciones um, sea la entidad principal toma: 
   *   cur: curso (toma.curso) fk
   *   cur_com: comision (curso.comision) fk
   *   cur_com-alumno/comision (alumno.comision) um
   * @returns 
   */

  serverData() { return this.adminForm.value }

  queryData(): Observable<any> {
    switch(this.queryApi){
      case "unique_rel_str": return this.dd.post("unique_rel", this.entityName, this.display$.value).pipe(
        switchMap(
          data => {
            console.log(data);
            return of(data)
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
}
