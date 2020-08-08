import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';
import { Display } from '@class/display';
import { first } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-admin',
  template: '',
})
export abstract class ShowElementComponent  {

  @Input() data$: Observable<any>; 
  /**
   * datos principales
   */

  @Input() display$?: Observable<Display>; 
  /**
   * No conviene utilizar ReplaySubject (como el padre?)
   */
 
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();

  constructor(
    protected router: Router,
  ) {}

  
  onChangePage($event: PageEvent){
    this.display$.pipe(first()).subscribe(
      display => {
        console.log(display);
        //this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
      }
    );
  }

  order(params: Array<string>): void {
    /**
     * Transformar valores de ordenamiento del atributo display
     */
    this.display$.pipe(first()).subscribe(
      display => {
        display.setOrderByKeys(params);
        this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
      }
    );
  }

}

