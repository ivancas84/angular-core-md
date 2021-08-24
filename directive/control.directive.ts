import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[controlHost]',
})
export class ControlDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}