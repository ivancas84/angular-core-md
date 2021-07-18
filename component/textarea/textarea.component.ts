import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AsyncValidatorOpt, ValidatorOpt } from '@class/validator-opt';

@Component({
  selector: 'core-textarea',
  templateUrl: './textarea.component.html',
})
export class TextareaComponent implements OnInit { //2
  @Input() field: FormControl;
  @Input() title?: string;
  @Input() placeholder?: string = "";
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
