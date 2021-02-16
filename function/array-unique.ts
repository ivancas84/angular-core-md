
export function arrayUnique(array){
  return array.filter(function(el, index, arr) {
      return index == arr.indexOf(el);
  });
}

