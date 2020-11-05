import { Component } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';


@Component({
  selector: 'core-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent {
  constructor(
    protected auth: AuthService,
  ) {}

  ngOnInit() {
    this.auth.logout();    
  }

}

