import { Pipe, PipeTransform } from '@angular/core';
import { time } from '@function/parser/time';

@Pipe({name: 'toTime'})
export class ToTimePipe implements PipeTransform {

  constructor() {}

  transform(value: string): Date | undefined {
    return time(value);
  }
}
