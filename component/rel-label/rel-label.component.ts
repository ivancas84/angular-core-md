import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { Display } from '@class/display';
import { DataDefinitionLabelService } from '@service/data-definition-label/data-definition-label.service';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'core-rel-label',
  templateUrl: './rel-label.component.html',
})
export class RelLabelComponent implements OnInit {
  
  @Input() display: Display; //parametros (habitualmente se define con display.getParams())
  @Input() entityName: string; //entidad a partir de la cual se buscaran las relaciones
  load$: Observable<any>;

  constructor(private dd: DataDefinitionService) { }
  
  ngOnInit(){
    var p = Object.keys(this.display.getParams());
    if(p.length == 1 && this.entityName && p[0].includes("-") && p[0].substring(p[0].indexOf("-")+1) == "id") {
      this.load$ = this.dd.post("rel",this.entityName).pipe(
        map(
          response => {
            var r = response[
              p[0].substring(0,p[0].indexOf("-"))
            ];
            r["value"] = this.display.getParams()[p[0]];
            return r;
          }
        )
      )  
    }
  }
}
