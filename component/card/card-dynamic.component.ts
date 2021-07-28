import { Component, Input } from '@angular/core';
import { FormGroupExt } from '@class/reactive-form-ext';
import { CardComponent } from '@component/card/card.component';

@Component({
  selector: 'core-card-dynamic',
  templateUrl: './card-dynamic.component.html',
  styles:[`
    .item { padding:10px; border: 1px solid #E6E6FA; }
  `]
})
export class CardDynamicComponent extends CardComponent { //2
  @Input() fieldset:  FormGroupExt;
  @Input() title:  FormGroupExt;

}
