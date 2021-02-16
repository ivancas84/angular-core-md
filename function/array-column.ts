
export function arrayColumn(array, key) {
    return array.map(value => value[key]);
}