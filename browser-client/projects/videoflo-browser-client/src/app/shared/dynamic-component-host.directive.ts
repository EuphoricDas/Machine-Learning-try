import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[dynamicComponentHost]'
})
export class DynamicComponentHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
