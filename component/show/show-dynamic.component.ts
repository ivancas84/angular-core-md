import { Component } from '@angular/core';
import { ShowComponent } from './show.component';
import { FieldViewOptions } from '@class/field-view-options';

@Component({
  selector: 'core-show-dynamic',
  template: '',
})
export abstract class ShowDynamicComponent extends ShowComponent {
  fieldsViewOptions: FieldViewOptions[] = []
  fieldsViewOptionsSp: FieldViewOptions[] = []
}
