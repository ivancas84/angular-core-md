import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FieldView } from '@class/field-view';
import { CardComponent } from '@component/card/card.component';

@Component({
  selector: 'core-card-dynamic',
  templateUrl: './card-dynamic.component.html',
  styles:[`
    .item { padding:10px; border: 1px solid #E6E6FA; }
  `]
})
export class CardDynamicComponent extends CardComponent {
  @Input() fields: FieldView[];
  @Input() title: string; //titulo del componente
}
