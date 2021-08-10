import { Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlConfig } from '@class/reactive-form-config';
 
@Component({
  selector: 'core-field-wrap',
  templateUrl: './field-wrap.component.html',
})
export class FieldWrapComponent implements OnInit {
  
  /**
   * Visualizacion auxiliar de campo
   */
  
  @Input() config: FormControlConfig; //conjunto de campos
  @Input() field: FormControl; //conjunto de campos
  /**
   * La visualizacion auxiliar de un campo utiliza datos adicionales que son indicados en fieldViewOptions
   */

  params: any = null;

  ngOnInit(){
    /*if(this.config.wrap && this.config.wrap.params){
      this.params = fastClone(this.config.wrap.params);
      for(var i in this.params){
        if(this.params.hasOwnProperty(i)){
          var key = this.params[i].match(/\{\{(.*?)\}\}/)
          if(key) this.params[i] = this.field.parent.controls[key[1]].value;
        }
      }
    }

    var s = this.field.parent.valueChanges.subscribe (
      formValues => { 
        console.log(formValues);
        this.params = fastClone(this.field.aux.params);
        if(this.field.aux && this.field.aux.params){
          for(var i in this.params){
            if(this.params.hasOwnProperty(i)){
              var key = this.params[i].match(/\{\{(.*?)\}\}/)
              if(key) this.params[i] = this.field.parent.controls[key[1]].value;
            }
          }
        }
      
      },
      error => {
        console.log(error) 
        //this.snackBar.open(JSON.stringify(error), "X"); 
      }
    );
    //this.subscriptions.add(s);*/
  }
}
