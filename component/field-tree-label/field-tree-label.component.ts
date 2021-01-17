import { Component, Input, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Component({
  selector: 'core-field-tree-label',
  templateUrl: './field-tree-label.component.html',
})
export class FieldTreeLabelComponent implements OnChanges {
  
  @Input() tree: any; //Arbol de entidades {fieldName:entityName, ...}
  @Input() id: string; //id inicial de consulta
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

      if(isEmptyObject(this._tree)) this._tree = null;
      else {
        this._fieldName = Object.keys(this._tree)[0];
        this._entityName = this._tree[this._fieldName]; //returns 'someVal'
        delete this._tree[this._fieldName];
      }
    }
  
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue && this._entityName && this._fieldName) {
      if(!changes['id'].currentValue) this._id = null;
      else {
        this.dd.get(this._entityName, this.id).subscribe(
          (row) => {
            this._id = row[this._fieldName];
          }
        );
      }
    }
  }


}
