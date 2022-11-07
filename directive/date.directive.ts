import { Directive } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Y_FORMATS } from 'app/core/const/Y_FORMATS';
import { DATE_FORMATS } from '../const/DATE_FORMATS';


@Directive({
  selector: '[dateFormatYyyy]',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: Y_FORMATS},
  ],
})
export class CustomDateFormatYyyy {
}

@Directive({
  selector: '[dateFormatDdMmYyyy]',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
  ]
})
export class CustomDateFormatDdMmYyyy {
}

/**
 * @example
 * 
 <mat-form-field dateFormatYyyy> 
    <mat-label>Año</mat-label>

    <input matInput 
        [matDatepicker]="fieldPicker" 
        formControlName="calendario-anio" 
        placeholder="Ingrese año">

    <mat-datepicker-toggle matSuffix 
        [for]="fieldPicker"></mat-datepicker-toggle>
        
    <mat-datepicker-toggle matSuffix 
        (click)="fs.setNullGroupKey(controlSearch,'calendario-anio')">
        <mat-icon matDatepickerToggleIcon>clear</mat-icon></mat-datepicker-toggle>
    
    <mat-datepicker #fieldPicker
            startView="multi-year"
            (yearSelected)="fs.datePickerYearGroupKey(controlSearch,'calendario-anio',$event,fieldPicker)">
    </mat-datepicker>
</mat-form-field>     
 */