import { Input, OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'app/core/const/DATE_FORMATS';
import { getControlName } from '@function/get-control-name';
import { AsyncValidatorOpt, ValidatorOpt } from '@class/validator-opt';

@Component({
  selector: 'core-input-date',
  templateUrl: './input-date.component.html',
  styles:[`
    mat-datepicker-toggle {
      display: inline-block;
  }
  `],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
  ]
})
export class InputDateComponent implements OnInit {
  @Input() field: FormControl;
  @Input() title?: string;
  @Input() placeholder?: string = "Seleccione fecha";
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
