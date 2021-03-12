import { Component, Input } from '@angular/core';
import { ShowComponent } from '@component/show/show.component';

@Component({
  selector: 'core-show-admin',
  template: '',
})
export abstract class ShowAdminComponent extends ShowComponent {
  /**
   * Grilla de administracion independiente de cada fila.
   * Por el momento no implementa ninguna funcionalidad adicional, 
   * pero se deja estructurado para incoporar posteriormente.
   * Version 1.1
   * Compatible con ShowComponent 1.x
   */

  @Input() queryApi: string = "all";



}
