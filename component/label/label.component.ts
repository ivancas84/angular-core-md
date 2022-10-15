import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'core-label',
  templateUrl: './label.component.html',
})
export class LabelComponent implements OnChanges {
  
  @Input() entityName!: string;
  @Input() id!: string;
  label?: any;

  constructor(
    protected dd: DataDefinitionService
  ) { }
  
  ngOnChanges(changes: SimpleChanges){
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue ) {
      if(!changes['id'].currentValue) this.label = null;
      else {
        this.dd.post("label_get",this.entityName, this.id).pipe(first()).subscribe(
          (label:any) => {this.label = label;}
        )
      }
    }
  }

}
