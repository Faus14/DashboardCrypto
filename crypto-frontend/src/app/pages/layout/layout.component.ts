import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

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
      // Aquí asumimos que el objeto loggedUser tiene una propiedad "role" o algo similar que determina si es admin
      this.isAdmin = this.loggedUser?.role === 'Admin'; // Cambia esto según tu estructura de datos
    }
  }

  onLogoff() {
    // Eliminar el usuario de localStorage
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('role');
    localStorage.removeItem('token');

    this.router.navigateByUrl('/login');
  }


}
