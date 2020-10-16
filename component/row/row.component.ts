import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Component({
  selector: 'core-row',
  templateUrl: './row.component.html',
})
export class RowComponent implements OnChanges {
  
  @Input() entityName: string;
  @Input() id: string;
  row: any;

  constructor(private dd: DataDefinitionService) { }
  
  ngOnChanges(changes: SimpleChanges){
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue ) {
      if(!changes['id'].currentValue) this.row = null;
      else {
        this.dd.get(this.entityName, this.id).subscribe(
          (row) => {this.row = row;}
        );
      }
    }
  }

}
