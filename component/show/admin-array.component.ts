import { OnInit, Component } from '@angular/core';
import { ShowComponent } from './show.component';
import { AbstractControlViewOption } from '@component/abstract-control-view2/abstract-control-view2.component';
import { EventButtonConfig } from '@component/event-button/event-button.component';
import { EventIconConfig } from '@component/event-icon/event-icon.component';
import { TableDynamicConfig } from '@component/table/table-dynamic.component';
import { FormArrayConfig, FormControlConfig } from '@class/reactive-form-config';


@Component({
  selector: 'core-show',
  template: './show.component.html',
})
export abstract class AdminArrayComponent extends ShowComponent implements OnInit {
  
  config: FormArrayConfig = new TableDynamicConfig()
  /**
   * @property config: Configuracion del form
   * 
   * Habitualmente es una instancia de TableDynamicConfig, pero puede ser
   * cualquier tipo de configuracion que administre un array.   
   **/

  optFooter: AbstractControlViewOption[] = [
  /**
   * @property optFooter: Opciones del footer
   * 
   * Se redefine para incluir elementos habituales de administracion
   */
    { //boton aceptar
      config: new EventButtonConfig({
        text: "Aceptar", 
        action: "submit",
        color: "primary",
        fieldEvent: this.optField
      }),
    },
    { //boton agregar
      config: new EventIconConfig({
        icon: "add", //texto del boton
        action: "add", //accion del evento a realizar
        color: "primary",
      })
    },
    { //boton volver
      config: new EventIconConfig({
        icon: "arrow_back", //texto del boton
        action: "back", //accion del evento a realizar
        color: "accent",
        fieldEvent: this.optField
      })
    },
    { //boton reset
      config: new EventIconConfig({
        icon: "autorenew", //texto del boton
        action: "reset", //accion del evento a realizar
        color: "accent",
        fieldEvent: this.optField
      })
    },
  ]
  
  ngOnInit(){
    if(!this.config.contains("_mode")) this.config.addControl("_mode", new FormControlConfig(null))
    if(!this.config.contains("id")) this.config.addControl("id", new FormControlConfig(null))

    this.optFooter[1].config.fieldEvent = this.config.optField

    this.config.optColumn = [ //columna opciones
      {  //boton eliminar 
        config: new EventIconConfig({
          action:"remove",
          color: "accent",
          fieldEvent:this.config.optField,
          icon:"delete"
        }),
      }
    ]
    super.ngOnInit()
  }

}
