[1mdiff --git a/component/field-tree-label/field-tree-label.component.ts b/component/field-tree-label/field-tree-label.component.ts[m
[1mindex a53594c..57a6ec4 100644[m
[1m--- a/component/field-tree-label/field-tree-label.component.ts[m
[1m+++ b/component/field-tree-label/field-tree-label.component.ts[m
[36m@@ -19,6 +19,10 @@[m [mexport class FieldTreeLabelComponent implements OnChanges {[m
   _fieldName: string;[m
 [m
   constructor(private dd: DataDefinitionService) { }[m
[32m+[m[32m  /**[m
[32m+[m[32m   * Obsoleto utilizar field-tree[m
[32m+[m[32m   * @param changes[m[41m [m
[32m+[m[32m   */[m
   [m
 [m
   ngOnChanges(changes: SimpleChanges){[m
[1mdiff --git a/component/field-tree/field-tree.component.html b/component/field-tree/field-tree.component.html[m
[1mindex 8d9c2ae..97c7ee9 100644[m
[1m--- a/component/field-tree/field-tree.component.html[m
[1m+++ b/component/field-tree/field-tree.component.html[m
[36m@@ -4,5 +4,5 @@[m
     <core-field-label [entityName]="tree.entityName" [id]="id" [fieldNames]="tree.fieldNames" [join]="tree.join"></core-field-label>[m
     <span *ngIf="tree.suffix">{{tree.suffix}}</span>[m
   </span>[m
[31m-  <core-field-tree *ngFor="let e of tree.tree; let i = index" [id]="data[e.fkName]" [tree]="e"></core-field-tree>[m
[32m+[m[32m  <core-field-tree *ngFor="let e of tree.tree; let i = index" [id]="data[tree.fkName]" [tree]="e"></core-field-tree>[m
 </span>[m
\ No newline at end of file[m
[1mdiff --git a/component/field-tree/field-tree.component.ts b/component/field-tree/field-tree.component.ts[m
[1mindex 821ebb0..7555db1 100644[m
[1m--- a/component/field-tree/field-tree.component.ts[m
[1m+++ b/component/field-tree/field-tree.component.ts[m
[36m@@ -10,7 +10,10 @@[m [mimport { Observable } from 'rxjs';[m
   templateUrl: './field-tree.component.html',[m
 })[m
 export class FieldTreeComponent implements OnInit {[m
[31m-  [m
[32m+[m[32m  /**[m
[32m+[m[32m   * Recorrer arbol de relaciones[m
[32m+[m[32m   * imprimir los campos indicados[m
[32m+[m[32m   */[m
   @Input() tree: FieldTreeElement;[m
   @Input() id: string; //id inicial de consulta[m
   data$: Observable<any>[m
[1mdiff --git a/service/auth/auth-guard.service.ts b/service/auth/auth-guard.service.ts[m
[1mindex f6bc6ba..f1e4db3 100644[m
[1m--- a/service/auth/auth-guard.service.ts[m
[1m+++ b/service/auth/auth-guard.service.ts[m
[36m@@ -17,7 +17,6 @@[m [mexport class AuthGuardService implements CanActivate {[m
     else if(this.auth.isAuthenticated()) {[m
       var token = this.auth.getToken();[m
       var view = (token && token.hasOwnProperty("view")) ? token["view"] : [];[m
[31m-      console.log(token["view"])[m
       if(!view.includes(route.routeConfig.path)){[m
         this.router.navigate(['login']);[m
         return false;[m
