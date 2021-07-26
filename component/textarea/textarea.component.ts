import { Input, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidatorMsg } from '@class/validator-msg';

@Component({
  selector: 'core-textarea',
  templateUrl: './textarea.component.html',
})
export class TextareaComponent {
  @Input() field: FormControl;
  @Input() title?: string;
  @Input() placeholder?: string = "";
  @Input() readonly?: boolean = false;
  @Input() validatorMsgs: ValidatorMsg[] = [];

  
}
