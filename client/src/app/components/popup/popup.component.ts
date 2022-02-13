import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent  {
  constructor(public auth: AuthService) {

  }

  loginWithRedirect(): void {
    // Call this to redirect the user to the login page
   this.auth.loginWithRedirect();
  }

  logout(): void {
    // Call this to log the user out of the application
    // this.comm.test().subscribe((claims)=>console.log(claims));
    this.auth.logout({ returnTo: window.location.origin });
  }
}
