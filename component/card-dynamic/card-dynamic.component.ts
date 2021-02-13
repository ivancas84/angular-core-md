import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardComponent } from '@component/card/card.component';
import { FieldViewOptions } from '@component/field-view/field-view.component';

@Component({
  selector: 'core-card-dynamic',
  templateUrl: './card-dynamic.component.html',
  styles:[`
    .item { padding:10px; border: 1px solid #E6E6FA; }
  `]
})
export class CardDynamicComponent extends CardComponent {
  @Input() fieldsViewOptions: FieldViewOptions[];
  @Input() title: string; //titulo del componente
}
