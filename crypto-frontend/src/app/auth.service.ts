import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar el operador 'map'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  // Método de login que guarda el token, rol y usuario
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(this.apiUrl, body).pipe(
      map((response: any) => { // Especifica el tipo de 'response'
        // Almacenar token, rol y usuario si la autenticación es exitosa
        if (response.token) {
          localStorage.setItem('token', response.token); // Guardar token en localStorage
        }
        if (response.role) {
          localStorage.setItem('role', response.role); // Guardar rol en localStorage
        }
        if (response.user) {
          localStorage.setItem('loggedUser', JSON.stringify(response.user)); // Guardar usuario en localStorage
        }
        return response;
      })
    );
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Devuelve true si el token está presente, false si no
  }

  // Logout, eliminando los datos del localStorage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('loggedUser');
  }

  // Obtener el usuario logueado desde localStorage
  getLoggedUser(): any {
    const localUser = localStorage.getItem('loggedUser');
    return localUser ? JSON.parse(localUser) : null;
  }

  // Obtener el rol del usuario desde localStorage
  getRole(): string {
    const role = localStorage.getItem('role');
    return role || '';
  }
}
