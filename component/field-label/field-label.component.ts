import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Component({
  selector: 'core-field-label',
  templateUrl: './field-label.component.html',
})
export class FieldLabelComponent implements OnChanges {
  
  @Input() entityName: string;
  @Input() id: string;
  @Input() fieldNames: string[];
  @Input() join: string = " ";
  label: string;

  constructor(private dd: DataDefinitionService) { }
  
  ngOnChanges(changes: SimpleChanges){
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue ) {
      if(!changes['id'].currentValue) this.label = null;
      else {
        this.dd.get(this.entityName, this.id).subscribe(
          (row) => {
            var f = [];
            var i = 0, len = this.fieldNames.length;
            while (i < len) {
              f.push(row[this.fieldNames[i]])
              i++
            }
            this.label = f.join(this.join);
          }
        );
      }
    }
  }

}
