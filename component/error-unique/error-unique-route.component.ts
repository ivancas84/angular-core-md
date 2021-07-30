import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UniqueValidatorMsg } from '@class/validator-msg';

@Component({
  selector: 'core-error-unique-route',
  templateUrl: './error-unique-route.component.html',
})
export class ErrorUniqueRouteComponent implements OnInit{
  /**
   * Definir ruteo para error unique
   */

  @Input() validatorMsg: UniqueValidatorMsg; //validators
  @Input() field: FormControl

  uniqueValue: string;

  ngOnInit(): void {
   this.field.statusChanges.subscribe(
      status => {
        if(this.field.hasError("notUnique")){
          this.uniqueValue = this.field.getError("notUnique");
              this.validatorMsg["queryParams"][this.validatorMsg["uniqueParam"]] = this.uniqueValue
          }
        }
    );
  }

}
