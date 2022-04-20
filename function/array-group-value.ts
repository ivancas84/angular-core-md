
export function arrayGroupValue(arr: Array<any>, key: string) {
    var ret: {[index:string]:any} = {};
    arr.forEach(element => {
        var v = element[key];
        if(!ret.hasOwnProperty(v)) ret[v] = [];
        ret[v].push(element);
    });
    return ret;
}