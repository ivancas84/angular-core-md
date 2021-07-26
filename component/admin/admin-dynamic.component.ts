import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AdminComponent } from './admin.component';
import { FormGroup } from '@angular/forms';
import { KeyValue } from '@angular/common';
import { FormArrayExt, FormGroupExt } from '@class/reactive-form-ext';
import { Observable } from 'rxjs/internal/Observable';
import { isEmptyObject } from '@function/is-empty-object.function';
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'core-admin-dynamic',
  template: './admin-dynamic.component.html',
})
export abstract class AdminDynamicComponent extends AdminComponent implements OnInit{

  adminForm: FormGroupExt
  isDeletable: boolean = false; //Flag para habilitar/deshabilitar boton eliminar
  title: string
  @Output() event: EventEmitter<any> = new EventEmitter();
  options: any[] = null; //opciones (si es null no se visualiza)
 
  abstract configForm();


  ngOnInit() {
    this.configForm()
    this.defaultValues = this.adminForm.defaultValues()
    super.ngOnInit()
  }


  switchAction($event:any){ 

    /**
     * Acciones de opciones
     * Sobescribir si se necesita utilizar eventos
     * Utilizar $event.action para la accion a ejecutar (corresponde a opt.action)
     * Utilizar $event.data para los datos a utilizar (corresponde a row)
     */  
    switch($event.action){
      case "delete":
        this.delete()
      break;
      default:
        throw new Error("Not Implemented");
    }   
  }

  emitEvent($event){
    console.log($event);
    switch($event.action){
      default:
        this.event.emit($event);
    }
  }
}
