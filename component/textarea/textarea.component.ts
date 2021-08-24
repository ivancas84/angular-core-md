import { Input, Component, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlComponent, FormControlConfig } from '@class/reactive-form-config';

export class TextareaConfig extends FormControlConfig {
  componentId: string = "textarea"
  title?: string;
  placeholder?: string = "";
  readonly?: boolean = false;

  constructor(attributes: any = {}) {
    super(attributes)
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}

@Component({
  selector: 'core-textarea',
  templateUrl: './textarea.component.html',
})
export class TextareaComponent implements ControlComponent {
  @Input() config: TextareaConfig;
  @Input() control: FormControl;

}
