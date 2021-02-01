import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { FieldTreeElement } from '@class/field-tree-element';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'core-field-tree',
  templateUrl: './field-tree.component.html',
})
export class FieldTreeComponent implements OnInit {
  /**
   * Recorrer arbol de relaciones
   * imprimir los campos indicados
   */
  @Input() tree: FieldTreeElement;
  @Input() id: string; //id inicial de consulta
  data$: Observable<any>

  constructor(private dd: DataDefinitionService) { }
  
  ngOnInit(){
    this.data$ = this.dd.get(this.tree.entityName, this.id);
  }

}
