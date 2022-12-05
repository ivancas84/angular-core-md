
export function acronym(str: string){
    return str.split(' ').map(function(item){return item[0]}).join('');
}
