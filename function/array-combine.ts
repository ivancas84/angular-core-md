export function arrayCombine (keys:any[], values:any[]) {
  const ret = {}
  if (keys.length !== values.length)  return false
  for (let i = 0; i < keys.length; i++) ret[keys[i]] = values[i]
  return ret
}