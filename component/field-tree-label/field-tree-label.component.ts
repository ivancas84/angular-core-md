import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Component({
  selector: 'core-field-tree-label',
  templateUrl: './field-tree-label.component.html',
})
export class FieldTreeLabelComponent implements OnChanges {
  
  @Input() tree: any;
  @Input() entityName: string;
  @Input() id: string;
  @Input() fieldNames: string[];
  @Input() join: string = " ";
  _tree: any
  _id: string  
  _entityName: string;
  _fieldName: string;

  constructor(private dd: DataDefinitionService) { }
  

  ngOnChanges(changes: SimpleChanges){
    if( changes['tree'] ) {
      this._tree=fastClone(changes['tree'].currentValue);
      for(var k in this._tree) {
        this._entityName = this._tree[k];
        this._fieldName = k;
        delete this._tree;
        break;
      }
      if(isEmptyObject(this._tree)) this._tree = null;
    }
  
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue && this._entityName && this._fieldName) {
      if(!changes['id'].currentValue) this._id = null;
      else {
        this.dd.get(this.entityName, this.id).subscribe(
          (row) => {
            this._id = row[this._fieldName];
          }
        );
      }
    }
  }


}
