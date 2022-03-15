import { AbstractControl, FormControl } from '@angular/forms';

export function markAllAsDirty(control: AbstractControl) { 
  /**
   * Marcar todos los elementos del formulario como touched 
   * Util para visualizar errores
   */
    if(control.hasOwnProperty('controls')) {
        control.markAsDirty({ onlySelf: true }) // mark group
        let ctrl = <any>control;
        for (let inner in ctrl.controls) markAllAsDirty(ctrl.controls[inner] as AbstractControl);
    }
    else {
      (<FormControl>(control)).markAsDirty({ onlySelf: true });
    }
    
}
  