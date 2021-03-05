import { Input, Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { TableComponent } from '@component/table/table.component';
import { fastClone } from '@function/fast-clone';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsDirty } from '@function/mark-all-as-dirty';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'core-table',
  template: '',
  styles:[`
  .mat-card-content { overflow-x: auto; }
  .mat-table.mat-table { min-width: 500px; }
  `],
})
export abstract class TableAdminComponent extends TableComponent implements OnChanges {
  /**
   * Elementos de uso habitual para una tabla de administracion
   * A diferencia de las Tablas de visualizacion, 
   * la tabla de administracion se implementa con elementos nativos HTML,
   * para facilitar el recorrido del array de FormGroups 
   * Este componente reune caracteristicas de TableComponent, AdminComponent, AdminArrayComponent
   * Version 1.0
   */
  @Input() forms: FormGroup[] = []; //Array de formularios que seran presentados
  /**
   * Importante! No es un FormArray, es un array de FormGroups
   * Cada fila (FormGroup) del array es tratado de forma independiente
   */

  persistApi: string = "persist";
  defaultValues: {[key:string]: any} = {};
  displayedColumns: string[] = ["nombre"]; //columnas a visualizar
  isSubmitted: boolean[] = [];
  readonly entityName: string; //entidad principal
  protected subscriptions = new Subscription(); //suscripciones en el ts

  constructor(
    protected router: Router, 
    protected fb: FormBuilder, 
    protected validators: ValidatorsService,
    protected dialog: MatDialog,
    protected dd: DataDefinitionToolService, 
    protected snackBar: MatSnackBar
  ) {
    super(router)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["dataSource"]){
      this.forms.length = 0; //inicializar
      for(var i = 0; i < this.dataSource.length; i++){
        this.add();
        var res = fastClone(this.dataSource[i]);
        this.forms[i].reset(res);
      }
    }
    //throw new Error('Method not implemented.');
  }
  
  abstract formGroup();

  add() {
    var fg = this.formGroup();
    fg.reset(this.defaultValues); 
    this.forms.push(fg);
    this.isSubmitted.push(false); 
  }

  remove(index) { 
    if(!this.forms[index].get("id").value) this.forms.splice(index, 1); 
    else throw new Error('Method not implemented.');
  }

  onSubmit(i){
    this.isSubmitted[i]=true
    if (!this.forms[i].valid) {
      this.cancelSubmit(i);
    } else {
      this.submit(i);
    }
  }

  cancelSubmit(i){
    markAllAsDirty(this.forms[i]);
    logValidationErrors(this.forms[i]);
    this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message: "El formulario " + i + "posee errores."}
    });
    this.isSubmitted[i] = false;
  }

  submit(i){
    var s = this.persist(i).subscribe(
      response => {
        this.submitted(i, response)        
      },
      error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
        this.isSubmitted[i] = false;
      }
    );
    this.subscriptions.add(s);
  }

  submitted(i, response){
    this.snackBar.open("Registro realizado", "X");
    //this.removeStorage(response);
    this.reload(i, response);
  }

  reload(i, response){
    /**
     * @todo Recargar valores de la fila i
     */
    throw new Error("Method not implemented");
    //let route = emptyUrl(this.router.url) + "?id="+response["id"];
    //if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    //else this.display$.next(this.display$.value);
    //this.isSubmitted = false;
  }

  persist(i): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd.post(this.persistApi, this.entityName, this.serverData(i))
  }

  serverData(i) {  
    return this.forms[i].value;
    //return this.adminForm.value
  }
  
}
