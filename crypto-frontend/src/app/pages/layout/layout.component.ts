import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  loggedUser: any;
  isAdmin: boolean = false;

  constructor(private router: Router) {
    const localUser = localStorage.getItem('loggedUser');
    
    if (localUser != null) {
      this.loggedUser = JSON.parse(localUser);
      this.isAdmin = this.loggedUser?.role === 'Admin';
    }
  }

  onLogoff() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('role');
    localStorage.removeItem('token');

    this.router.navigateByUrl('/login');
  }


}
