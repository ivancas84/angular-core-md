export class TableDynamicOptions {
  addButtonLink: string = null;
  addButtonQueryParams: { [index: string]: any } = {};
  copyButton: boolean = true;
  printButton: boolean = true;
  sortActive: string = null;
  sortDirection: string = "asc";

  constructor(attributes: any) {
    for(var a in attributes){
      if(attributes.hasOwnProperty(a)){
        this[a] = attributes[a]
      }
    }
  }
}
