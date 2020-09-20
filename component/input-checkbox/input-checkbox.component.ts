import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControlName } from '@function/get-control-name';

@Component({
  selector: 'core-input-checkbox',
  templateUrl: './input-checkbox.component.html',
})
export class InputCheckboxComponent implements OnInit {
  /**
   * Checbox no admite placeholder, error unique, error require.
   * Se define por defecto un error general que puede ser validado como further_error
   */
  @Input() field: FormControl;
  @Input() title?: string;

  ngOnInit(): void {
    if(!this.title) this.title = getControlName(this.field)
  }
   
}
