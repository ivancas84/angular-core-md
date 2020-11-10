import { Injectable } from '@angular/core';

import { JwtHelperService } from "@auth0/angular-jwt";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper: JwtHelperService;
  jwt: string = "";

  constructor(
    protected cookie: CookieService,
  ) { 
    this.jwt = this.cookie.get('jwt');
    this.jwtHelper = new JwtHelperService();
  }

  public login(jwt): void {
    this.jwt = jwt;
    this.cookie.set('jwt', this.jwt);
  }

  public logout(): void {
    this.cookie.delete("jwt")
    this.jwt = '';
  }

  public isAuthenticated(): boolean {
    this.jwt = this.cookie.get('jwt');
    if(!this.jwt) return false;
    return !this.jwtHelper.isTokenExpired(this.jwt);
  }

  public getToken(){
    if(!this.isAuthenticated()) return false;
    return this.jwtHelper.decodeToken(this.jwt);
  }

  public hasPermission(permissions: string[]): boolean{
    if(!this.isAuthenticated()) return false;
    var scope:string[] = this.jwtHelper.decodeToken(this.jwt)["scope"];
    if(!scope.length) return false;
    
    for(var p in permissions){
      for(var s in scope){
        var p_ = permissions[p].split(".");
        var s_ = scope[s].split(".");  
        if (s_[0] == p_[0]){
          var i = p_[1].length;
          while (i--) {
            if(!(s_[1].includes(p_[1].charAt(i)))) return false;
          }
          break;
        }
      }
    }
    return true;
  }

  
}
