import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private timeout: any;
  private readonly idleTimeout: number = 60000000;

  constructor(private router: Router, private authService: AuthService) {}

 
  startInactivityTimer() {
    this.resetInactivityTimer();

  
    window.addEventListener('click', this.resetInactivityTimer.bind(this));
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
    window.addEventListener('scroll', this.resetInactivityTimer.bind(this));
  }


  private resetInactivityTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }


    this.timeout = setTimeout(() => {
      this.logoutAndRedirect();
    }, this.idleTimeout);
  }

  private logoutAndRedirect() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  stopInactivityTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
