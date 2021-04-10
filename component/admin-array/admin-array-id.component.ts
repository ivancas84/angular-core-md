import { Observable, of } from 'rxjs';
import { Component } from '@angular/core';
import { AdminComponent } from '@component/admin/admin.component';
import { fastClone } from '@function/fast-clone';

@Component({
  selector: 'core-admin-array-id',
  template: '',
})
export abstract class AdminArrayIdComponent extends AdminComponent { //2
/**
 * Variante del formulario de administracion que recibe obligatoriamente un identificador
 * y lo transfiere a sus componentes anidados
 * El identificador no necesariamente debe ser el id
 */
  
  readonly idName: string; //nombre del identificador
 
  initParams(params: any){
    if(params.hasOwnProperty(this.idName) && params[this.idName]) {  
      return params;
    } else {
      this.snackBar.open("Error de parametros", "X"); 
      throw new Error("Error de parametros");
    }
  }

  initData(): Observable<any> {
    return of(fastClone(this.display$.value));
  }

  persist(): Observable<any> {
    return this.dd.post("persist_array", this.entityName, this.serverData())
  }

  reload(response){
    /**
     * Recargar una vez persistido
     */
    this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

  /*serverData() { 
    /**
     * se deja como referencia si se desea sobrescribir
     * puede ser util incluir el valor del parametro
     *
    this.adminForm.addControl(this.idName, this.display$.value);
    return this.adminForm.value
  }*/

}