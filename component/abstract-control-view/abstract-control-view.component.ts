import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormConfig } from '@class/reactive-form-config';

export interface AbstractControlViewOption {
  config: FormConfig
  control?: AbstractControl
} 

@Component({
  selector: 'core-abstract-control-view',
  templateUrl: './abstract-control-view.component.html',
})
export class AbstractControlViewComponent {
  /**
   * visualizacion de AbstractControl
   * utilizado principalmente para FormArray y FormGroup, los FormControl tienen su propia implementacion
   */

  @Input() config?: FormConfig;
  @Input() control?: AbstractControl;
  @Input() index?: number; 


  
}
