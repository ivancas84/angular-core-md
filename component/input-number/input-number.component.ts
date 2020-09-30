import { Component } from '@angular/core';
import { InputTextComponent } from '@component/input-text/input-text.component';

@Component({
  selector: 'core-input-number',
  templateUrl: './input-number.component.html',
})
export class InputNumberComponent extends InputTextComponent {
  /**
   * Identico al InputTextComponent
   * Modifica algunos errores en el template
   */
}
