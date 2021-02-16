import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { emptyUrl } from '@function/empty-url.function';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Component } from '@angular/core';
import { AdminComponent } from '@component/admin/admin.component';
import { fastClone } from '@function/fast-clone';
import { AdminArrayComponent } from '@component/admin-array/admin-array.component';

@Component({
  selector: 'core-admin-array',
  template: '',
})
export abstract class AdminArrayIdsComponent extends AdminArrayComponent {
/**
 * Variante del AdminArray que define datos solo si existen ids
 */
  initDisplay(params){ 
    var p = (params.hasOwnProperty("ids")) ? params["ids"] : null;
    this.display$.next(p);  
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
    );
  }

  
  reload(response){
    let route = emptyUrl(this.router.url) + "?ids="+response["ids"].join("&ids=");
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }


}