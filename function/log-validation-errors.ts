import { ValidationErrors, FormGroup, FormArray, AbstractControl, FormControl } from "@angular/forms";

export function logValidationErrors(formGroup: FormGroup | FormArray) {
    /**
     * log de errores del formulario
     * Utilizado opcionalmente para propositos de Debug
     */
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if(control instanceof FormControl) {
          if(control.errors) {
            Object.keys(control.errors).forEach(keyError => {
              console.log('* ERROR: ' + key + ': ' + keyError + ':' + control.errors![keyError]);
            })
          }      

      } else if(control instanceof FormGroup ) {
        console.log("FormGroup " + key);
        logValidationErrors(control.controls[key] as FormGroup);
      }
      
      else if(control instanceof FormArray ) {
        console.log("FormArray " + key);

        for (let i = 0; i < control.controls.length; i++){
          console.log("+ index " + i);
          logValidationErrors(control.controls[i] as FormGroup);
        }
      }
    });
  }