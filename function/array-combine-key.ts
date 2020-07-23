import { arrayCombine } from './array-combine';
import { arrayColumn } from './array-column';

export function arrayCombineKey(values: Array<any>, key: string) {
    return arrayCombine(arrayColumn(values, key), values);
}