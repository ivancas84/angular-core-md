import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UniqueValidatorOpt } from '@class/validator-opt';

@Component({
  selector: 'core-error-unique-route',
  templateUrl: './error-unique-route.component.html',
})
export class ErrorUniqueRouteComponent implements OnInit{
  /**
   * Definir ruteo para error unique
   */

  @Input() avo: UniqueValidatorOpt; //validators
  @Input() field: FormControl

  uniqueValue: string;

  ngOnInit(): void {
   this.field.statusChanges.subscribe(
      () => {
        if(this.field.hasError("notUnique")){
          this.uniqueValue = this.field.getError("notUnique");
              this.avo["queryParams"][this.avo["uniqueParam"]] = this.uniqueValue
          }
        }
    );
  }

}
