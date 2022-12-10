import { AbstractControl } from "@angular/forms";
import { Subject, tap, switchMap, startWith, filter, take } from "rxjs";

/**
 * @source https://stackoverflow.com/questions/49516084/reactive-angular-form-to-wait-for-async-validator-complete-on-submit
 * @example
 *   onSubmit(onSubmit$,control).subscribe((validationSuccessful) => onSubmit.emit(fieldsetName));
 */
 export function onSubmit(onSubmit$: Subject<any>, control:AbstractControl){
  return onSubmit$
    .pipe(
      tap(() => control.markAsDirty()),
      switchMap(() =>
        control.statusChanges.pipe(
          startWith(control.status),
          filter(status => status !== 'PENDING'),
          take(1)
        )
      ),
      filter(status => status === 'VALID')
    )
    
}
 

