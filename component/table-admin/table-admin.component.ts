import { Input, Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { TableComponent } from '@component/table/table.component';
import { emptyUrl } from '@function/empty-url.function';
import { fastClone } from '@function/fast-clone';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsDirty } from '@function/mark-all-as-dirty';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
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
   * Version 1.1
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
    protected snackBar: MatSnackBar,
    protected storage: SessionStorageService
  ) {
    super(router)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["dataSource"]){
      this.forms.length = 0; //inicializar
      for(var i = 0; i < this.dataSource.length; i++){
        this.addFg();
        var res = fastClone(this.dataSource[i]);
        this.forms[i].reset(res);
      }
    }
  }
  
  abstract formGroup();

  addFg() {
    var fg = this.formGroup();
    fg.reset(this.defaultValues); 
    this.forms.push(fg);
    this.isSubmitted.push(false); 
  }

  add() {
    this.addFg();
    this.length++
    this.display.setSize(this.display.getSize() + 1)
  }

  remove(index) { 
    if(!this.forms[index].get("id").value) this.forms.splice(index, 1); 
    else throw new Error('Method not implemented.');
    this.display.setSize(this.display.getSize() - 1)
    this.length--
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
    this.removeStorage(response);
    this.reload(i, response["id"]);
  }

  removeStorage(response){
    this.storage.removeItemsContains(".");
    this.storage.removeItemsPersisted(response["detail"]);
    this.storage.removeItemsPrefix(emptyUrl(this.router.url));
  }

  reload(i, id){
    /**
     * @todo Recargar valores de la fila i
     */
    this.dd.get(this.entityName, id).subscribe(
      row => {
        this.forms[i].reset(row)
        this.isSubmitted[i] = false
        console.log(this.forms[i].value)
      }
    )
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
