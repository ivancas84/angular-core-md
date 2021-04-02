import { Input, Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { DialogConfirmComponent } from '@component/dialog-confirm/dialog-confirm.component';
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
export abstract class TableAdminComponent extends TableComponent implements OnChanges { //2
  /**
   * Elementos de uso habitual para una tabla de administracion
   * A diferencia de las Tablas de visualizacion, 
   * la tabla de administracion se implementa con elementos nativos HTML,
   * para facilitar el recorrido del array de FormGroups 
   * A diferencia de los componentes habituales de administracion,
   * TableAdminDynamicComponent define las relaciones y ejecuciones
   * en el mismo componente
   * Este componente reune caracteristicas de TableComponent, AdminComponent, AdminArrayComponent
   */

  readonly entityName: string; //entidad principal
  forms: FormGroup[] = []; //Array de formularios que seran presentados
  /**
   * Importante! No es un FormArray, es un array de FormGroups
   * Cada fila (FormGroup) del array es tratado de forma independiente
   * @todo reemplazar por FormArray y definir en el formulario padre,
   * de esta forma se tiene mayor control sobre ciertas operaciones
   */

  persistApi: string = "persist"; 
  /**
   * Puede utilizarse persist_rel_array
   * si se desea administrar una entidad y sus relaciones
   */

  reloadApi: string = "get";
  /**
   * Puede utilizarse persist_rel_array
   * si se desea administrar una entidad y sus relaciones
   */

  deleteApi: string = "delete";
  defaultValues: {[key:string]: any} = {};
  isSubmitted: boolean[] = [];
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
    super(router, dd)
  }

  ngOnChanges(changes: SimpleChanges): void {
    /**
     * no se detectan directamente los cambios en el dataSource
     * es necesario utilizar ngOnChanges y recargar el formulario
     */
    if(changes["dataSource"]){
      this.forms.length = 0; //inicializar
      for(var i = 0; i < this.dataSource.length; i++){
        this.add();
        var res = fastClone(this.dataSource[i]);
        this.forms[i].reset(res);
      }
    }
  }
  
  abstract formGroup();

  add() {
    var fg = this.formGroup();
    fg.reset(this.defaultValues); 
    this.forms.push(fg);
    this.isSubmitted.push(false); 
  }


  onRemove(index) { 
    if(!this.forms[index].get("id").value) {
      this.forms.splice(index, 1); 
    }
    else {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {title: "Eliminar registro " + index, message: "Está seguro?"}
      });
 
      var s = dialogRef.afterClosed().subscribe(result => {
        if(result) this.remove(index)
      });
      this.subscriptions.add(s)

    }
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

  submit(index: number){
    var s = this.persist(index).subscribe(
      response => {
        this.submitted(index, response);     
      },
      error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
        this.isSubmitted[index] = false;
      }
    );
    this.subscriptions.add(s);
  }

  submitted(i, response){
    this.snackBar.open("Registro realizado", "X");
    this.reload(i, response["id"]);
    this.removeStorage(response);
    this.length++
  }

  deleted(index, response){
    this.forms.splice(index, 1); 
    this.snackBar.open("Registro eliminado", "X");
    this.removeStorage(response);
    //this.display.setSize(this.display.getSize() - 1)
    this.length--
  }

  removeStorage(response){
    this.storage.removeItemsContains(".");
    this.storage.removeItemsPersisted(response["detail"]);
    this.storage.removeItemsPrefix(emptyUrl(this.router.url));
  }

  reload(index: number, id){
    /**
     * @todo Recargar valores de la fila i
     */
    this.switchReload(id).subscribe(
      row => {
        this.forms[index].reset(row)
        this.isSubmitted[index] = false
      }
    )
  }

  switchReload(id): Observable<any>{
    switch(this.reloadApi){
      case "get": return this.dd.get(this.entityName, id);
      default: return this.dd._post("unique_rel_array", this.entityName, id)
    }
  }

  persist(index: number): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd._post(this.persistApi, this.entityName, this.serverData(index))
  }

  remove(index: number) {
    var s = this.delete(index).subscribe(
      response => {
        this.deleted(index, response)        
      },
      error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
        this.isSubmitted[index] = false;
      }
    );
    this.subscriptions.add(s);
  }

  delete(index: number): Observable<any> {
    /**
     * Eliminacion
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd.post(this.deleteApi, this.entityName, [this.forms[index].get("id").value])
  }


  serverData(i) {  
    return this.forms[i].value;
    //return this.adminForm.value
  }
  
}
