import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(this.apiUrl, body);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    console.log('isAuthenticated:', !!token); // Log para verificar
    return !!token; // Retorna `true` si hay token
  }
  

  logout(): void {
    localStorage.removeItem('loggedUser');
  }
  
getLoggedUser(): any {
    const localUser = localStorage.getItem('loggedUser');
    if(localUser != null) {
      return JSON.parse(localUser);
    }
    return null;
  }

  getRole(): string {
    const role = localStorage.getItem('role');
    console.log('getRole - Rol del usuario desde localStorage:', role);
    return role || ''; // Devuelve una cadena vacía si no existe
  }

}

