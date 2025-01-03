import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj: LoginModel = new LoginModel();
  isSignDivVisiable: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.authService.login(this.loginObj.username, this.loginObj.password).subscribe(
      (response: any) => {
        console.log('Login exitoso:', response);
        const role = response.user?.role; 
        localStorage.setItem('loggedUser', JSON.stringify(response.user));
  
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        console.error('Error en el login:', error);
        alert('No se encontró el usuario o la contraseña es incorrecta');
      }
    );
  }
  
  
}

export class LoginModel {
  username: string = '';
  password: string = '';
}
