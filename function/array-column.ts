
export function arrayColumn(array: any[], key: string): any[] {
    return array.map(value => value[key]);
}