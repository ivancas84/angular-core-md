import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "summary" })
export class SummaryPipe implements PipeTransform {
    transform(value: string, length: number): string { return (!value || value.length < length) ? value : value.substring(0,length) + " ... "; };
}
