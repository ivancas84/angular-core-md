import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { emptyUrl } from '../../function/empty-url.function';
import { isEmptyObject } from '../../function/is-empty-object.function';
import { Component } from '@angular/core';
import { AdminComponent } from '@component/admin/admin.component';
import { fastClone } from '@function/fast-clone';

@Component({
  selector: 'core-admin-array',
  template: '',
})
export abstract class AdminArrayComponent extends AdminComponent {
/**
 * Formulario de administracion para un conjunto de datos
 * Es similiar a AdminComponent pero tiene ciertas restricciones para trabajar con un conjunto de datos
 */

  initParams(params: any){
    if(params.hasOwnProperty("ids") && params["ids"]) {  
      this.adminForm.get("ids").setValue(params["ids"]);
      return params;
    } else {
      this.snackBar.open("Error de parametros", "X"); 
      throw new Error("Error de parametros");
    }
  }
  
  initData(): Observable<any> {
    return of({}).pipe(
      switchMap(() => {
        if(isEmptyObject(this.display$.value)) return of ([]);
        else return this.dd.getAll(this.entityName, this.display$.value).pipe(
          map(
            response=> {return response.filter(function (el) { return el != null; });}
          )
        )
      }),
      map(
        data => {
          if(!isEmptyObject(data)) return data;
          return fastClone(this.display$.value)
          /**
           * Se retorna un clone para posibilitar el cambio y el uso de ngOnChanges si se requiere
           */
        }
      )
    );
  }

  persist(): Observable<any> {
    return this.dd.post("persist_array", this.entityName, this.serverData())
  }

  reload(response){
    let route = emptyUrl(this.router.url) + "?ids="+response["ids"].join("&ids=");
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

}