export function sortLabelValue(fieldName:string, row:{[i:string]:any}, options:{[i:string]:{[j:string]:any}[]}): any{
  if(!options.hasOwnProperty(fieldName)) return row[fieldName]

  for(var i = 0; i < options[fieldName].length; i++){
    if(row[fieldName] == options[fieldName][i]["id"]) return options[fieldName][i]["label"]
  }

}


