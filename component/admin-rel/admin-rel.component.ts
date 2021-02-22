import { OnInit, AfterViewInit, Component } from '@angular/core';
import { AdminRelStructure } from '@class/admin-rel-structure';
import { AdminComponent } from '@component/admin/admin.component';
import { fastClone } from '@function/fast-clone';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'core-admin-rel',
  template: '',
})
export abstract class AdminRelComponent extends AdminComponent implements OnInit, AfterViewInit {
/**
 * Especializacion del formulario de administracion 
 * para administrar una entida y sus relaciones
 */
  loadTree$: Observable<any>; //carga de parametros
  tree: any;
  structure:AdminRelStructure[];
  persistApi:string = "persist_rel";

  ngOnInit() {
    this.loadTree();
    this.loadStorage();
    this.loadParams();
    this.loadDisplay();
  }

  loadTree() {
    this.loadTree$ = this.dd.post("tree",this.entityName).pipe(
      map(
        tree => { 
          this.tree = tree;
          return true; 
        },
        error => { this.snackBar.open(JSON.stringify(error), "X"); }
      )
    );
  }

  loadDisplay(){
    this.loadDisplay$ =  this.display$.pipe(
      switchMap(
        () => { return this.initData(); }
      ),
      map(
        response => {
          this.walkData(this.tree, response);
          return true;
        }
      )
    )
  }
  
  walkData(tree, response: { [x: string]: any }){
    for(var j = 0; j < this.structure.length; j++){
      if(this.structure[j].id == this.entityName){
        this.structure[j].data = response;
        if(isEmptyObject(tree[t]["children"])) this.walkData(tree[t]["children"], response);
        continue;
      } 

      for(var t in tree){
        if (tree.hasOwnProperty(t)){
          var id = this.structure[j].id.substring(
            0,this.structure[j].id.indexOf("-")
          )
          
          if(id == t){
            this.structure[j].data = (response.hasOwnProperty(tree[t].field_name + "_")) ? fastClone(response[tree[t].field_name + "_"]) : null;
            if(isEmptyObject(tree[t]["children"])) this.walkData(tree[t]["children"], response[tree[t].field_name + "_"]);
            continue;
          }
        }
      }
    }
  }

  serverData() { return this.adminForm.value }

}
