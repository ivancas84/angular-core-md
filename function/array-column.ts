
export function arrayColumn(array, key): any[] {
    return array.map(value => value[key]);
}