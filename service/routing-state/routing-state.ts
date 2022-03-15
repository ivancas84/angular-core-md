import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoutingState {
  private history = [];

  constructor(
    private router: Router
  ) {}

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });

  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/index';
  }

  redirectTo(uri:string){
    /**
     * Efectua un reload pero ruteando, primero a la raiz y luego a la uri especificada
     */
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigateByUrl(uri));
 }

  reloadCurrentRoute() {
    /**
     * Efectua un reload pero ruteando, primero a la raiz y luego a la url actual
     */
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}