import { Pipe, PipeTransform } from '@angular/core';
import { date } from '@function/parser/date';

@Pipe({name: 'toDate'})
export class ToDatePipe implements PipeTransform {

  constructor() {}

  transform(value: string): Date | undefined{
    return date(value);
  }
}
