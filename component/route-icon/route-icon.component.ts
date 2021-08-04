import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
 
@Component({
  selector: 'core-route-icon',
  templateUrl: './route-icon.component.html',
})
export class RouteIconComponent implements OnInit {
  /**
   * Visualizar opciones
   */

  @Input() icon: string
  @Input() routerLink: string
  @Input() key: string
  @Input() color: string
  @Input() target: string
  @Input() title?: string
  @Input() field: FormControl
  queryParams: any = {};

  ngOnInit(): void {
    if(!this.title) this.title = this.routerLink;
    
    this.field.valueChanges.pipe(
        startWith(this.field.value)
      ).subscribe(
        () => {
          this.queryParams[this.key] = this.field.value
        }
      )
  }
}
