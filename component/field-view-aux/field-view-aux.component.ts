import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormGroupExt, FormControlExt } from '@class/reactive-form-ext';
import { fastClone } from '@function/fast-clone';
 
@Component({
  selector: 'core-field-view-aux',
  templateUrl: './field-view-aux.component.html',
})
export class FieldViewAuxComponent implements OnInit {
  
  /**
   * Auxiliar para Field View
   * Verifica caracteristicas "auxiliares" de FieldViewOptions 
   * para definir una "presentacion" auxiliar complementaria a FieldView 
   * Invoca luego a Field View
   */

  @Input() fieldset: FormGroupExt; //opciones
  /**
   * Las opciones principales para definir enlaces son
   * routerLink: Ruta
   * queryParamField: Nombre del campo que sera utilizado como id para la ruta [queryParams]="{id:data[fieldViewOptions.queryParamField]}"
   */  
  
  @Input() field: FormControlExt; //conjunto de campos
  /**
   * La visualizacion auxiliar de un campo utiliza datos adicionales que son indicados en fieldViewOptions
   */

  params: any = null;

  ngOnInit(){
    var s = this.fieldset.valueChanges.subscribe (
      formValues => { 
        console.log(formValues);
        this.params = fastClone(this.field.aux.params);
        if(this.field.aux && this.field.aux.params){
          for(var i in this.params){
            if(this.params.hasOwnProperty(i)){
              var key = this.params[i].match(/\{\{(.*?)\}\}/)
              if(key) this.params[i] = this.fieldset.controls[key[1]].value;
            }
          }
        }
      
      },
      error => {
        console.log(error) 
        //this.snackBar.open(JSON.stringify(error), "X"); 
      }
    );
    //this.subscriptions.add(s);
  }
}
