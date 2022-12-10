import { FormGroup } from "@angular/forms"
import { Display } from "@class/display"
import { isEmptyObject } from "@function/is-empty-object.function"
import { BehaviorSubject, Observable, map } from "rxjs"

/**
 * Comportamiento habitual para inicializar un search control
 * @example loadControl$ =  loadSearchControl(this.controlSearch, this.display$)
 */
 export function loadSearchControl(control: FormGroup, display$: BehaviorSubject<Display>): Observable<any> {
  return display$.pipe(
      map(
          display => {
              if(!isEmptyObject(display.getParams()))
              control.reset(display.getParams()) 
              return true
          }
      )
    )
}
