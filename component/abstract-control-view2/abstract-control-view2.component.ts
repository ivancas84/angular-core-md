import { Component, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ControlComponent, FormConfig } from '@class/reactive-form-config';
import { ControlDirective } from '@directive/control.directive';

export interface AbstractControlViewOption {
  config: FormConfig
  control?: AbstractControl
} 

@Component({
  selector: 'core-abstract-control-view2',
  template:`<ng-template controlHost></ng-template>`,
})
export class AbstractControlView2Component {
  /**
   * visualizacion de AbstractControl
   * utilizado principalmente para FormArray y FormGroup, los FormControl tienen su propia implementacion
   */

  @Input() config?: FormConfig;
  @Input() control?: AbstractControl;
  @Input() index?: number; 

  @ViewChild(ControlDirective, {static: true}) controlHost!: ControlDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.config.component);
    
    const viewContainerRef = this.controlHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(componentFactory);
    componentRef.instance.config = this.config;
    componentRef.instance.control = this.control;
    componentRef.instance.index = this.index;

  }


}
