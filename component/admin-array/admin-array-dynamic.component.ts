import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Display } from '@class/display';
import { AdminArrayComponent } from './admin-array.component';

@Component({
  selector: 'core-admin-array',
  template: '',
})
export abstract class AdminArrayDynamicComponent extends AdminArrayComponent { //2
/**
 * Formulario de administracion para un conjunto de datos
 * Es similiar a AdminComponent pero tiene ciertas restricciones para trabajar con un conjunto de datos
 */

 title: string;


}