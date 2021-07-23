import { FormControl } from "@angular/forms";

class FormControlExt extends FormControl{
  /**
   * @example Using FormGroup
   * const formGroup = new FormGroup({
   *   firstName: new FormControlExt('',[])
   * });
   * (formGroup.get('firstName') as StandardFormControl).label = 'customValue';
   * 
   * var f = new FormControlExt();
   * f.label = "test"
   */
   label?: string = null //etiqueta campo
}