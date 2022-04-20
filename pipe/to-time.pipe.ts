import { Pipe, PipeTransform } from '@angular/core';
import { Parser } from '@class/parser';

@Pipe({name: 'toTime'})
export class ToTimePipe implements PipeTransform {

  constructor() {}

  transform(value: string): Date | undefined {
    return Parser.time(value);
  }
}
