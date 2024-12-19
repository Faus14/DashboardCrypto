import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('canActivate - Verificando autenticación...');
    
    if (!this.authService.isAuthenticated()) {
      console.log('Usuario no autenticado. Redirigiendo a /login');
      this.router.navigate(['/login']);
      return false;
    }
  
    const expectedRole = route.data['role'];
    const userRole = this.authService.getRole();
  
    console.log('Rol requerido:', expectedRole);
    console.log('Rol del usuario:', userRole);
  
    if (expectedRole && userRole !== expectedRole) {
      console.log('Acceso denegado. Redirigiendo a /unauthorized');
      this.router.navigate(['/unauthorized']);
      return false;
    }
  
    console.log('Acceso permitido.');
    return true;
  }
}  