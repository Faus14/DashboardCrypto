import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private timeout: any;
  
  private readonly idleTimeout: number = 300000; 

  constructor(private router: Router, private authService: AuthService) {}

 
  startInactivityTimer() {
    this.resetInactivityTimer();
    window.addEventListener('click', this.resetInactivityTimer.bind(this));
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
    window.addEventListener('scroll', this.resetInactivityTimer.bind(this));
  }

  // Restablecer el temporizador de inactividad cada vez que el usuario interactúe
  private resetInactivityTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout); // Limpiar el temporizador anterior
    }

    // Establecer un nuevo temporizador de inactividad
    this.timeout = setTimeout(() => {
      this.logoutAndRedirect();
    }, this.idleTimeout);
  }

  // Desconectar al usuario y redirigir al login
  private logoutAndRedirect() {
    this.authService.logout(); // Limpiar la sesión
    this.router.navigate(['/login']); // Redirigir al login
  }

  // Detener el temporizador si es necesario (en caso de que se cierre sesión o cambie la vista)
  stopInactivityTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout); // Limpiar el temporizador
    }
  }
}
