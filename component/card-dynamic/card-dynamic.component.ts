import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FieldConfig } from '@class/field-config';
import { CardComponent } from '@component/card/card.component';

@Component({
  selector: 'core-card-dynamic',
  templateUrl: './card-dynamic.component.html',
  styles:[`
    .item { padding:10px; border: 1px solid #E6E6FA; }
  `]
})
export class CardDynamicComponent extends CardComponent implements OnChanges{
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
 
 
  @Input() fields: FieldConfig[];
  @Input() title: string; //titulo del componente
}
