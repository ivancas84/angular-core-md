import { Component, OnInit } from '@angular/core';

import { AbstractControlViewOption } from '@component/abstract-control-view2/abstract-control-view2.component';
import { EventButtonConfig } from '@component/event-button/event-button.component';
import { EventIconConfig } from '@component/event-icon/event-icon.component';
import { DetailComponent } from '@component/detail/detail.component';

@Component({
  selector: 'core-admin',
  template: '../detail/detail.component.html',
})
export abstract class AdminComponent extends DetailComponent implements OnInit{
  /**
   * Extension de DetailComponent que define caracteristicas para facilitar la
   * administracion. 
   * 
   * Por ejemplo define los botones del footer para aceptar, o reestablecer el 
   * formulario.
   */
  
  optFooter: AbstractControlViewOption[] = [ //opciones de componente
    {
      config: new EventButtonConfig({
        text: "Aceptar", //texto del boton
        action: "submit", //accion del evento a realizar
        color: "primary",
        fieldEvent: this.optField
      }),
    },
    {
      config: new EventIconConfig({
        icon: "arrow_back", //texto del boton
        action: "back", //accion del evento a realizar
        color: "accent",
        title:"Volver",
        fieldEvent: this.optField
      })
    },
    {
      config: new EventIconConfig({
        icon: "add", //texto del boton
        action: "clear", //accion del evento a realizar
        color: "accent",
        title:"Nuevo",
        fieldEvent: this.optField
      })
    },
  ]; 

}
