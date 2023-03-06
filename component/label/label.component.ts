import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { first } from 'rxjs/operators';

/**
 * Componente para visualizar rapidamente el label de una entidad
 * Se utiliza principalmente para acelerar el desarrollo.
 */
@Component({
  selector: 'core-label',
  templateUrl: './label.component.html',
})
export class LabelComponent implements OnChanges {
  
  @Input() entity_name!: string;
  @Input() id?: string;
  label?: any;

  constructor(
    protected dd: DataDefinitionService
  ) { }
  
  ngOnChanges(changes: SimpleChanges){
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue ) {
      if(!changes['id'].currentValue) this.label = null;
      else {
        this.dd.post("label_get",this.entity_name, this.id).pipe(first()).subscribe(
          (row:any) => {this.label = row["label"];}
        )
      }
    }
  }

}
