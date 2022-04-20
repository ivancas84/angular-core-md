import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { DataDefinitionLabelService } from '@service/data-definition-label/data-definition-label.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'core-label',
  templateUrl: './label.component.html',
})
export class LabelComponent implements OnChanges {
  
  @Input() entityName!: string;
  @Input() id!: string;
  label?: any;

  constructor(private ddl: DataDefinitionLabelService) { }
  
  ngOnChanges(changes: SimpleChanges){
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue ) {
      if(!changes['id'].currentValue) this.label = null;
      else {
        this.ddl.label(this.entityName!, this.id).pipe(first()).subscribe(
          (label:any) => {this.label = label;}
        );
      }
    }
  }

}
