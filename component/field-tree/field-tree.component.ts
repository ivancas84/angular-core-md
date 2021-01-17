import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { FieldTreeElement } from '@class/field-tree-element';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Component({
  selector: 'core-field-tree',
  templateUrl: './field-tree.component.html',
})
export class FieldTreeComponent implements OnChanges {
  
  @Input() tree: FieldTreeElement[];
  @Input() id: string; //id inicial de consulta
 
  element: FieldTreeElement; 

  _tree: any
  _id: string  

  constructor(private dd: DataDefinitionService) { }
  

  ngOnChanges(changes: SimpleChanges){
    if( changes['tree'] ) {
      this._tree=fastClone(changes['tree'].currentValue);
      if(!this._tree.length) this._tree = null;
      else {
        this.element = this._tree[0];
        this._tree[0].shift()
      }
    }
  
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue && this.element.entityName && this.element.fkName) {
      if(!changes['id'].currentValue) this._id = null;
      else {
        this.dd.get(this.element.entityName, this.id).subscribe(
          (row) => {
            this._id = row[this.element.fkName];
          }
        );
      }
    }
  }


}
