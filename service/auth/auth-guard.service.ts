import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  
  constructor(public auth: AuthService, public router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    else if(this.auth.isAuthenticated()) {
      var token = this.auth.getToken();
      var view = (token && token.hasOwnProperty("view")) ? token["view"] : [];
      if(!view.includes(route.routeConfig.path)){
        this.router.navigate(['login']);
        return false;
      }
    }
    return true;
  }
}