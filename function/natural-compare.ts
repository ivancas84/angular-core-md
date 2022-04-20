export function naturalCompare(a: any, b: any) {
  var ax: any[][] = [], bx: any[][] = [];

  if(!a) a = ""; //evitar error toString in null
  if(!b) b = ""; //evitar error toString in null
  a.toString().replace(/(\d+)|(\D+)/g, function(_: any, $1: any, $2: any) { ax.push([$1 || Infinity, $2 || ""]) });
  b.toString().replace(/(\d+)|(\D+)/g, function(_: any, $1: any, $2: any) { bx.push([$1 || Infinity, $2 || ""]) });
  
  while(ax.length && bx.length) {
      var an = ax.shift();
      var bn = bx.shift();
      var nn; 
      if(an && bn) nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
      if(nn) return nn;
  }

  return ax.length - bx.length;
}