import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
 
@Component({
  selector: 'core-link-text',
  templateUrl: './link-text.component.html',
})
export class LinkTextComponent implements OnInit {
  /**
   * Visualizar opciones
   */

  @Input() download: boolean = false
  @Input() prefix: string
  @Input() target: string
  @Input() title?: string
  @Input() field: FormControl
  href: string

  ngOnInit(): void {
    this.field.valueChanges.pipe(
        startWith(this.field.value)
      ).subscribe(
        () => {
          this.href = this.prefix+this.field.value
          //this.queryParams[this.key] = this.field.value
        }
      )
  }
}
