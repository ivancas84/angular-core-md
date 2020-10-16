import { Pipe, PipeTransform } from '@angular/core';
import { Parser } from '@class/parser';

@Pipe({name: 'toDate'})
export class ToDatePipe implements PipeTransform {

  constructor() {}

  transform(value: string): Date {
    return Parser.date(value);
  }
}
