import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Display } from '@class/display';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
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
