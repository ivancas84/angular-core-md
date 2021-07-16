import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldControlOptions } from '@class/field-type-options';
import { AsyncValidatorOpt, UniqueValidatorOpt, ValidatorOpt } from '@class/validator-opt';

@Component({
  selector: 'core-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements OnInit{ //2.2

  @Input() field: FormControl
  @Input() title?: string
  @Input() placeholder?: string = ""
  @Input() type?: string = "text"
  @Input() width?: string = null
  /**
   * Ancho exclusivo del input
   * se aplica al contenedor utilizando [style.width]="width"
   * Debe indicarse la unidad de medida, ej "100%", "100px"
   */

  @Input() readonly?: boolean = false;
  @Input() validatorOpts?: ValidatorOpt[] = [] //validators
  @Input() asyncValidatorOpts?: AsyncValidatorOpt[] = [] //validators


  uniqueValue: string;

  ngOnInit(): void {
   this.field.statusChanges.subscribe(
      () => {
        if(this.field.hasError("notUnique")){
          this.uniqueValue = this.field.getError("notUnique");
          for(var i = 0; i < this.asyncValidatorOpts.length; i++){
            if(this.asyncValidatorOpts[i].id=="notUnique") 
              this.asyncValidatorOpts[i]["queryParams"][this.asyncValidatorOpts[i]["uniqueParam"]] = this.uniqueValue
          }
        }
      }
    );
    
  }

}
