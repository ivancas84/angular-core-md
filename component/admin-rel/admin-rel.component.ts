import { OnInit, AfterViewInit, Component } from '@angular/core';
import { AdminRelStructure } from '@class/admin-rel-structure';
import { AdminComponent } from '@component/admin/admin.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'core-admin-rel',
  template: '',
})
export abstract class AdminRelComponent extends AdminComponent implements OnInit, AfterViewInit {
/**
 * Especializacion del formulario de administracion 
 * para administrar una entidad y sus relaciones
 */

  structure:AdminRelStructure[];
  persistApi:string = "persist_rel";

  queryData(): Observable<any> {
    return this.dd.post("unique_rel", this.entityName, this.display$.value)
  }

  serverData() { return this.adminForm.value }

}
