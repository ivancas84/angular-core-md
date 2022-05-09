import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionToolService } from '@service/data-definition/data-definition-tool.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { emptyUrl } from '@function/empty-url.function';
import { map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { isEmptyObject } from '@function/is-empty-object.function';
import { FormGroupConfig } from '@class/reactive-form-config';
import { StructureComponent } from '@component/structure/structure.component';
import { Display } from '@class/display';
import { AbstractControlViewOption } from '@component/abstract-control-view/abstract-control-view.component';

@Component({
  selector: 'core-detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent extends StructureComponent implements OnInit{

  entityName!: string;
  override control: FormGroup = new FormGroup({}, {updateOn:"blur"})
  config!: FormGroupConfig

  inputSearchGo: boolean = true;
  /**
   * @property inputSearchGo: Flag para activar / desactivar componente
   * inputSearchGo
   * 
   * El componente InputSearchGo permite buscar y activar una determinada tu-
   * pla de una entidad.
   **/


  optFooter: AbstractControlViewOption[] = []; //columna opciones

  override ngOnInit(){
    /**
     * Si no esta definido el control, se crea, en base a config.
     */
    this.initControl()
    super.ngOnInit()
  }

  initControl(){
    this.config.initAdmin()
    this.config.initControl(this.control)
  }

  getStorageValues(): any {
    return this.control.getRawValue()
  }

  loadDisplay(){
    /**
     * Definicion de valores en base al display.
     * 
     * La asignacion de valores en base al display, se define asincronicamente,
     * resulta útil para reasignar valores directamente al display y reiniciar,
     * por ejemplo al limpiar o resetear la propiedad "form"
     * 
     * @summary Procedimiento de definicion de datos:
     * Si existen valores del storage, se inicializa el formulario utilizan-
     * zando el storage,  si no existen valores del storage se invoca al meto
     * do initData para inicializar los datos.
     *
     * @description 0: El metodo initData realiza una inicializacion de datos
     * simple, que consulta los datos de la base de datos o define datos por 
     * defecto (habitualmente un conjunto vacio de datos). loadDisplay es un
     * metodo mas avanzado de definicion de datos que utiliza el resultado de
     * initData, el storage y valores por defecto
     */
    this.loadDisplay$ = this.display$.pipe(
      //startWith(null),
      switchMap(
        () => {
          this.storageValues = this.storage.getItem(this.router.url)
          // this.form.reset() comente el reset porque no se si aporta alguna funcionalidad
          this.storage.removeItemsPrefix(emptyUrl(this.router.url))
          console.log(this.storageValues)
          if(!isEmptyObject(this.storageValues)) return of(this.storageValues)
          else return this.initData();
        }
      ),
      map(
        data => { 
          // this.form.reset() comente el reset porque no se si aporta alguna funcionalidad
          this.control.patchValue(this.config.defaultValues())
          /**
           * Se asigna inicialmente los valores por defecto, nada me garantiza
           * que el parametro "data" posea todos los valores definidos.
           */

          if(!isEmptyObject(data)) this.control.patchValue(data)
          
          return true;
        }
      ),
    )
  }

  override initDisplay() {
    /**
     * Inicializar propiedad display$
     * 
     * Por defecto se inicializa con la propiedad params
     */
    var display = new Display();
    display.setSize(100); //se asigna size por defecto por las dudas
    display.setParamsByQueryParams(this.params);
    this.display$.next(display)
  }


  override initData(): Observable<any> {
    if(isEmptyObject(this.params)) return of({})
    return this.queryData()
  }

  queryData(): Observable<any>{
    return this.dd.unique(this.entityName, this.params)
  }

  override persist(): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd._post("persist", this.entityName, this.serverData())
  }

  override reload(){
    /**
     * Recargar una vez persistido
     */
    let route = emptyUrl(this.router.url) + "?id="+this.response["id"];
    if(route != this.router.url) this.router.navigateByUrl('/' + route, {replaceUrl: true});
    else this.display$.next(this.display$.value);
    this.isSubmitted = false;
  }

  
}
