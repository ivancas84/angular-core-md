import { Component } from '@angular/core';

import { AdminComponent } from './admin.component';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-admin-dynamic',
  template: './admin-dynamic.component.html',
})
export abstract class AdminDynamicComponent extends AdminComponent {

  title: string
  fieldsViewOptions: FieldViewOptions[]
}
