
export function arrayClean(array){
    return array.filter(function (el) {
      return (el != null && el != undefined);
    });
}

