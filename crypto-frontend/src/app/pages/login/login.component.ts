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
  registerObj: RegisterModel = new RegisterModel();
  isModalOpen: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.loginObj.username || !this.loginObj.password) {
      this.errorMessage = 'Debes completar todos los campos.';
      return;
    }

    this.authService.login(this.loginObj.username, this.loginObj.password).subscribe(
      (response: any) => {
        const token = response.token;
        localStorage.setItem('token', token);
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        console.error('Error en el login:', error);
        this.errorMessage = 'No se encontró el usuario o la contraseña es incorrecta.';
      }
    );
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= 8;
  }
  
  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.registerObj.username || !this.registerObj.password) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    if (!this.validateEmail(this.registerObj.username)) {
      this.errorMessage = 'Ingrese un correo electrónico válido.';
      return;
    }

    if (!this.validatePassword(this.registerObj.password)) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    this.authService.register(this.registerObj.username, this.registerObj.password).subscribe(
      (response: any) => {
        console.log('Usuario registrado exitosamente', response);
        this.successMessage = 'Registro exitoso.';
        this.errorMessage = '';
        this.closeRegisterModal();
        this.autoClearSuccess();
      },
      (error) => {
        console.error('Error al registrar', error);
        this.errorMessage = error.error.message || 'Error al registrar usuario.';
        this.successMessage = '';
      }
    );
  }

  openRegisterModal() {
    this.registerObj = new RegisterModel();
    this.isModalOpen = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeRegisterModal() {
    this.isModalOpen = false;
    this.errorMessage = '';
  }

  autoClearSuccess() {
    setTimeout(() => {
      this.successMessage = '';
    }, 5000); // 5 segundos
  }
}

export class LoginModel {
  username: string = '';
  password: string = '';
}

export class RegisterModel {
  username: string = '';
  password: string = '';
}
