
export function arrayClean(array: any[]){
    return array.filter(function (el) {
      return (el != null && el != undefined);
    });
}

