import { Component, Input} from '@angular/core';
import { FieldView } from '@class/field-view';

@Component({
  selector: 'core-field-view',
  templateUrl: './field-view.component.html',
})
export class FieldViewComponent {
  
  @Input() config: FieldView;
  @Input() data: { [index: string]: any };
}
