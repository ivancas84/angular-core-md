import { Component, Input, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
import { ControlDirective } from '@directive/control.directive';

export interface AbstractControlViewOption {
  config: FormControlConfig
  control?: AbstractControl
} 

@Component({
  selector: 'core-abstract-control-view',
  template:`<ng-template controlHost></ng-template>`,
})
export class AbstractControlViewComponent {
  /**
   * visualizacion de AbstractControl
   * utilizado principalmente para FormArray y FormGroup, los FormControl tienen su propia implementacion
   */

  @Input() config!: FormControlConfig;
  @Input() control?: AbstractControl;
  @Input() index?: number; 

  @ViewChild(ControlDirective, {static: true}) controlHost!: ControlDirective;

  ngOnInit(): void {
    /**
     * @version 10
     * const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.config.component);
     * const componentRef = viewContainerRef.createComponent<any>(componentFactory);
     * 
     * @version 13   
     * const componentRef = viewContainerRef.createComponent<any>(this.config.component);
     */
    const viewContainerRef = this.controlHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(this.config.component);
    componentRef.instance.config = this.config;
    componentRef.instance.control = this.control;
    componentRef.instance.index = this.index;

  }


}
