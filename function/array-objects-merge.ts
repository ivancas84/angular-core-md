
export function arrayObjectsMerge(
  response:{[index:string]: any}[], 
  data:{[index:string]: any}[], 
  responseId:string, 
  dataId:string): {[index:string]: any}[] 
{
  var res: {[index:string]: any}[] = []
  for(var i = 0; i < response.length; i++){
    res[i] = response[i]
    for(var j = 0; j < data.length; j++){
      if(response[i][responseId] == data[j][dataId]) {
        res[i] =  Object.assign(res[i], data[j]) 
      }
      break;
    }
  }
  return res
}

