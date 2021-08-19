import { Component, Input} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AbstractControlViewOptions } from '@class/abstract-control-view-options';
import { FormConfig } from '@class/reactive-form-config';

@Component({
  selector: 'core-abstract-control-view',
  templateUrl: './abstract-control-view.component.html',
})
export class AbstractControlViewComponent {
  /**
   * visualizacion de AbstractControl
   * utilizado principalmente para FormArray y FormGroup, los FormControl tienen su propia implementacion
   */

  @Input() config: FormConfig;
  @Input() control: AbstractControl;
  @Input() viewOptions?: AbstractControlViewOptions; //para el caso de config.id == form_control se define en el config.viewOptions
  @Input() index?: number;



  
}
