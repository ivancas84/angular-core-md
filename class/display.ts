import { isEmptyObject } from '../function/is-empty-object.function';
import { Filter } from './filter';

export class Display {

  protected size?: number;
  /**
   * size se establece por defecto en el servidor y en el componente de paginacion en 100
   */

  protected page: number = 1;
  /**
   * inicializar page siempre para evitar errores en los componentes de paginacion
   */

  protected order: {[key: string]: string } = {};
  protected condition: Array<any> = [];
  protected params?: {[key: string]: any } = {} //busqueda adicional
  /** 
   * El servidor limita siempre la cantidad de elementos (size) a 100
   * Si se desea un valor mayor debe definirse explicitamente en el servidor
   */
  
  /**
   * Atributos para consultas avanzadas
   */
  protected fields: {[key: string]: string } = {}; 
  protected group: {[key: string]: string } = {};
  protected having: Array<any> = [];

  public getSize(){ return this.size }
  public getPage(){ return this.page }
  public getOrder(){ return this.order }
  public getCondition(){ return this.condition }
  public getParams(){ return this.params }
  public getParam(key:string){ 
    return this.params?.hasOwnProperty(key)? this.params[key] : null; 
  }

  public getFields(): {[key: string]: string|string[] } { return this.fields }
  public getGroup(): {[key: string]: string|string[] } { return this.group }
  public getHaving(){ return this.having }

  public setSize(size: number) { this.size = size; }
  public setPage(page: number) { this.page = page; }

  public addCondition(condition: any[]){ this.condition.push(condition); }
  public setCondition(condition: any[]){ this.condition = condition; }
  
  public addField(field: string){
    /**
     * se obtiene el indice mayor y se incrementa en uno
     */
    var keys = Object.keys(this.fields);
    var key = 0;
    for (var i = keys.length - 1; i >= 0; i--) {
      if(/^\d+$/.test(keys[i])){
        key = parseInt(keys[i]);
        key+=1;
      }
    }
    this.fields[key]=field;
  }

  public addFieldAs(key:string,field:string){
    this.fields[key]=field;
  }
    
  public setFields(fields: {[key: string]: string }){
    //this.fields = Object.assign({}, fields)
    /**
     * @todo La sentencia this.fields = Object.assign({}, fields) deberia funcionar
     * pero el compilador de angular/typescript tira un error de tipo
     * se modifica el codigo a continuacion para que no indique el error,
     * se volvera a probar en futuras versiones
     */
    this.fields = {};
    var obj = Object.assign({}, fields)
    for(var x in obj) {
      if(obj.hasOwnProperty(x)) this.fields[x] = obj[x];
    }
  }

  public setFieldsArray(fields: string[]){
    this.fields = {};
    for(var i = 0; i < fields.length; i++) this.fields[fields[i]] = fields[i];
  }

  public addGroup(field: string){
    /**
     * se obtiene el indice mayor y se incrementa en uno
     */
    var keys = Object.keys(this.group);
    var key = 0;
    for (var i = keys.length - 1; i >= 0; i--) {
      if(/^\d+$/.test(keys[i])){
        key = parseInt(keys[i]);
        key+=1;
      }
    }
    this.group[key]=field;
  }
  public addGroupAs(key:string,field:string){
    this.group[key]=field;
  }
    
  public setGroup(fields: {[key: string]: string }){
    //this.group = Object.assign({}, fields)
    /**
     * @todo La sentencia this.group = Object.assign({}, fields) deberia funcionar
     * pero el compilador de angular/typescript tira un error de tipo
     * se modifica el codigo a continuacion para que no indique el error,
     * se volvera a probar en futuras versiones
     */
    this.group = {};
    var obj = Object.assign({}, fields)
    for(var x in obj) this.group[x] = obj[x];
  }

  public setGroupArray(group: string[]){
    this.group = {};
    for(var i = 0; i < group.length; i++) this.group[group[i]] = group[i];
  }

  public addHaving(condition: any){ this.having.push(condition); }
  public setHaving(condition: any[]){ this.having = condition; }

  public describe(){
    let ret: {[key: string]: any } = {};
    if(this.size || (this.size === 0)) ret["size"] = this.size;
    if(this.page) ret["page"] = this.page;
    if(!isEmptyObject(this.order)) ret["order"] = this.order;
    if(this.condition.length) ret["condition"] = this.condition;
    if(!isEmptyObject(this.params)) ret["params"] = this.params;
    if(!isEmptyObject(this.fields)) ret["fields"] = this.fields;
    if(!isEmptyObject(this.fields)) ret["group"] = this.group;
    if(this.having.length) ret["having"] = this.having;
    
    return ret;
  }

  public setParams(params: {[key: string]: any }){
    this.params = {};
    for(var i in params){
      if (params.hasOwnProperty(i)){
        if(params[i] !== undefined && params[i] !== null && params[i] !== "" ) {
          this.params[i] = params[i];
        } 
      }
    }    
  }

  public addOrder(key: string, value: any){
    this.order[key] = value;
  }

  public addParam(key: string, value: any){
    this.params![key] = value;
  }

  public addParamIfNot(key: string, value: any){
    if(this.params!.hasOwnProperty(key)) return;
    this.params![key] = value;
  }

  public addConditionIfNot(condition: Array<any>){
    for(var i in this.condition){
      if(this.condition[i][0] == condition[0] && this.condition[i][1] == condition[1] ) return;
    }

    this.addCondition(condition);
  }

  public setConditionByQueryParams(params: any){
  /**
   * Transformar "queryParams" en conditions
   */
    this.condition = [];
    for(let i in params) {
      if(params.hasOwnProperty(i)) {
        if(!(this.hasOwnProperty(i))) this.addCondition([i, "=", params[i]]); //asignar filtro
        else (this as any)[i] = JSON.parse(decodeURI(params[i])); //asignar parametro
      }
    }
  }
  
  public setConditionByFilters(filters:Array<Filter>){ 
    this.condition = [];
    for(let i = 0; i < filters.length; i++){
      console.log(filters[i])
      if(filters[i]["value"] !== undefined) this.addCondition([filters[i]["field"], filters[i]["option"], filters[i]["value"]]);
    }    
  }

  public setOrderByElement(order:Array<{[key:string]:string}>){
    this.order = {};
    for(let i in order) {
      if(order.hasOwnProperty(i)) {
        this.addOrder(order[i]["key"],order[i]["value"]);
     }
    }
  }
  
  public setParamsByQueryParams(params: any){
    /**
     * Transformar "queryParams" en conditions
     */
    for(let i in params) {
      if(params.hasOwnProperty(i)) {
        if(!(this.hasOwnProperty(i))) this.addParamIfNot(i, params[i]); //asignar filtro
        else (this as any)[i] = JSON.parse(decodeURI(params[i])); //asignar parametro
      }
    }
  }

  public setOrder(params: {[key: string]: string }){
    this.order = {};
    for(var i in params){
      if (params.hasOwnProperty(i)){ this.order[i] = params[i]; }
    }    
  }

  public setOrderByKeys(params: Array<string>){
    var keys = Object.keys(this.order);
    if((keys.length) && (params[0] == keys[0])){
      this.order[keys[0]] = (this.order[keys[0]].toLowerCase() == "asc") ? "desc" : "asc";
    } else {
      var obj:  {[key: string]: string } = {};
      for(var i in params) obj[params[i]] = "asc"
      this.setOrder(obj);
    }    
  }

  public setOrderInvert(params: {[key: string]: string }){
    /**
     * argumentos dinamicos: nombres de campos
     * si ya existia el nombre del campo le invierte el orden
     */
    var keys = Object.keys(this.order);
    var keys2 = Object.keys(params)

    if((keys.length) && (keys2[0] == keys[0])){
      var type: string = (this.order[keys[0]].toLowerCase() == "asc") ? "desc" : "asc";
      this.order[keys[0]] = type;
    } else {
      this.setOrder(params);
    }
  }
  
  public encodeURI(){
    let d = [];
    var r = this.describe()
    for(var key in this.describe()){ //Se accede al metodo display.describe() para ignorar los filtros no definidos
      if(r.hasOwnProperty(key)){
        if(r[key]){
          d.push(key + "=" + encodeURI(JSON.stringify(r[key])));
        }
      }
    }
    return d.join("&")
  }

  public hasFilters(){
    return (isEmptyObject(this.params) && !this.condition.length)
  }
}
