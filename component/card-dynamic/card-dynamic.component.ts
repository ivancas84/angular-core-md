import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FieldViewOptions } from '@class/field-view-options';
import { CardComponent } from '@component/card/card.component';

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
