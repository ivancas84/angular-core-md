
export function objectMagic(obj, newObj){
  Object.keys(obj).forEach(function(key) {
    delete obj[key];
  });

  Object.keys(newObj).forEach(function(key) {
    obj[key] = newObj[key];
  });
}

