import { Component, Input } from '@angular/core';

@Component({
  selector: 'core-menu-login',
  templateUrl: './menu-login.component.html',
})
export class MenuLoginComponent { 

  @Input() title = "App"
}