import { Input, OnInit, Component, DoCheck, OnDestroy} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';
import { first, map, startWith, mergeMap, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Display } from '../../class/display';


@Component({
  selector: 'core-input-picker',
  template: '',
})
export abstract class InputPickerComponent implements  OnInit, OnDestroy {
  /**
   * Input picker
   * Define un formulario independiente para seleccionar el valor de una entidad a traves de multiples campos
   */

  @Input() field: FormControl;
  @Input() readonly?: boolean = false;
  readonly entityName: string;
  form: FormGroup;

  protected subscriptions = new Subscription();

  constructor(protected fb: FormBuilder, protected dd: DataDefinitionService) { }

  ngOnInit(): void {
    this.formGroup();
    this.valueChangesField();
    this.valueChangesFormSubmit();
  }

  abstract formGroup(): void;
  /**
   * this.form = this.fb.group({ ... controls ... });
   */


  initValue(value){
    this.dd.get(this.entityName, value).pipe(first()).subscribe(
      row => {
        if(row) { 
          this.form.reset(row);
          this.form.disable();
        } else {
          this.form.reset();
          if(!this.readonly) this.form.enable();
        }
      }
    );
  }
  
  valueChangesField(): void {
    if(this.field.value) this.initValue(this.field.value);

    var s = this.field.valueChanges.subscribe(
      value => this.initValue(value)
    );

    this.subscriptions.add(s);
  }
  
  valueChangesFormSubmit(): void {
    this.form.valueChanges.subscribe(
      values => {
        if(!this.field.value){
          for (var key in values) {
            if(!values.hasOwnProperty(key) || !values[key]) return;
          }
          this.onSubmit();
        }
      }
    )
  }

  onSubmit(): void {
    var display = new Display
    for (var key in this.form.value) {
      if(!this.form.value.hasOwnProperty(key) || !this.form.value[key]) return;
      display.addParam(key, this.form.value[key]);
    }
    this.field.markAsPending();
    this.dd.id(this.entityName, display).pipe(first()).subscribe(
      (res) => {
        this.field.setValue(res);
        this.field.markAsDirty();
      },
      (err) => {  
        console.log(err);
      }
    );
  }
  
  ngOnDestroy () { this.subscriptions.unsubscribe() }
}
