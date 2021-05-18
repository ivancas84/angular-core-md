import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { emptyUrl } from '@function/empty-url.function';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Component } from '@angular/core';
import { AdminComponent } from '@component/admin/admin.component';
import { Display } from '@class/display';

@Component({
  selector: 'core-admin-array',
  template: '',
})
export abstract class AdminArrayComponent extends AdminComponent { //2
/**
 * Formulario de administracion para un conjunto de datos
 * Es similiar a AdminComponent pero tiene ciertas restricciones para trabajar con un conjunto de datos
 */


  
  initData(): Observable<any> {
    return of({}).pipe(
      switchMap(() => {
          var d = new Display();
          d.setSize(0);
          return this.dd.all(this.entityName, d);
      }),
    );
  }

  persist(): Observable<any> {
    return this.dd.post("persist_array", this.entityName, this.serverData())
  }

  reload(response){
    this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

}