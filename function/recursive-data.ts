
export function recursiveData(
  tree:string[], 
  data: { [index: string]: any } | { [index: string]: any }[]
): any[]{
  /**
   * Obtener datos recorriendo recursivamente a partir de un arbol de identificadores
   * El objetivo de este metodo es poder obtener un subarray y asignarle valores
   * de forma tal que, usando las caracteristicas referenciales de javascript,
   * los valores nuevos se reflejen en el array original
   */
  var tree_ = [...tree];
  var _data = [];
  
  tree_.shift();

  if(!Array.isArray(data)){
    if(tree_.length) {
      return recursiveData(tree_, data[tree[0]])
    } else {
      return data[tree[0]]
    }
  }

  for(var i = 0; i < data.length; i++){
    var _dataAux = []
    if(tree_.length) {
      _dataAux = recursiveData(tree_, data[i][tree[0]])
    } else {
      _dataAux = data[i][tree[0]]
    }

    if(!Array.isArray(_dataAux)){
      _data.push(_dataAux)
    } else {
      for(var j=0; j<_dataAux.length;j++){
        _data.push(_dataAux[j])
      }
    }
  }

  return _data;

}