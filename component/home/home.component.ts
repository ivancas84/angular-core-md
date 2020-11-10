import { Component } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';


@Component({
  selector: 'core-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    protected auth: AuthService,
  ) {}


}

