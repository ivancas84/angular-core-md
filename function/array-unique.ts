
export function arrayUnique(array: any[]){
  return array.filter(function(el, index, arr) {
      return index == arr.indexOf(el);
  });
}

