
export function objectMagic(obj: { [x: string]: any; }, newObj: { [x: string]: any; }){
  Object.keys(obj).forEach(function(key) {
    delete obj[key];
  });

  Object.keys(newObj).forEach(function(key) {
    obj[key] = newObj[key];
  });
}

