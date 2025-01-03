import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  loggedUser: any;
  isAdmin: boolean = false;

  constructor(private router: Router) {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.loggedUser = { username: decodedToken.username, role: decodedToken.role };
        this.isAdmin = decodedToken.role === 'Admin';
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.router.navigateByUrl('/login');
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  onLogoff() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
