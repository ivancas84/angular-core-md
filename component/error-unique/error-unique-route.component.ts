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
  @Input() control: FormControl

  uniqueValue: string;

  ngOnInit(): void {
   this.control.statusChanges.subscribe(
      status => {
        if(this.control.hasError("notUnique")){
          this.uniqueValue = this.control.getError("notUnique");
              this.validatorMsg["queryParams"][this.validatorMsg["uniqueParam"]] = this.uniqueValue
          }
        }
    );
  }

}
