export function sortLabelValue(field_name:string, row:{[i:string]:any}, options:{[i:string]:{[j:string]:any}[]}): any{
  if(!options.hasOwnProperty(field_name)) return row[field_name]

  for(var i = 0; i < options[field_name].length; i++){
    if(row[field_name] == options[field_name][i]["id"]) return options[field_name][i]["label"]
  }

}


