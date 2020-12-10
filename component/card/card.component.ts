import { Input, Component } from '@angular/core';

@Component({
  selector: 'core-card',
  template: '',
})
export abstract class CardComponent {
  /**
   * Componente card
   */

  @Input() data: any; //datos del formulario
  @Input() entityName: string; //entidad principal del componente

  


}
