
export function arrayMagic(reference, array){
  [].splice.apply(reference, [0, reference.length].concat(array));
}

