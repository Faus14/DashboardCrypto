import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuarioForm: any = { id: null, username: '', password: '', role: '' };
  isEditing: boolean = false; 
  displayedColumns: string[] = ['username', 'role', 'acciones']; 
  isModalOpen: boolean = false;
  errorMessage = ''; 
  loggedUserId: number | null = null;
  passwordError = '';
  usernameError = '';
  roleError = ''; 
  

  constructor(private userService: UserService) { }



  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.loggedUserId = decoded.userId;
    }
    this.getAllUsers();
  }


  validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    if (!this.usuarioForm.username) {
      this.usernameError = 'El correo electrónico es requerido';
      return false;
    }
    
    if (!emailRegex.test(this.usuarioForm.username)) {
      this.usernameError = 'Ingrese un correo electrónico válido';
      return false;
    }
    
    this.usernameError = '';
    return true;
  }


  validateRole(): boolean {
    if (!this.usuarioForm.role) {
      this.roleError = 'Debe seleccionar un rol';
      return false;
    }
    
    this.roleError = '';
    return true;
  }

  validatePassword(): boolean {
    if (this.isEditing && !this.usuarioForm.password) {
      this.passwordError = '';
      return true;
    }

    if (this.usuarioForm.password.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres';
      return false;
    }

    this.passwordError = '';
    return true;
  }


  validateForm(): boolean {
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    const isRoleValid = this.validateRole();

    return isEmailValid && isPasswordValid && isRoleValid;
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener los usuarios', error);
        this.errorMessage = 'Verifique la autenticación.';
      }
    );
  }

  createUser(): void {
    if (!this.validateForm()) {
      return;
    }

    this.userService.createUser(this.usuarioForm).subscribe(
      (data) => {
        this.getAllUsers();
        this.closeModal(); 
        this.resetForm();
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = error.error.message || 'Error al crear el usuario';
      }
    );
  }

  editUser(user: any): void {
    this.isEditing = true;
    this.usuarioForm = { ...user, password: '' };
    this.isModalOpen = true;
    this.resetErrors();
  }

  updateUser(): void {
    if (!this.validateForm()) {
      return;
    }

    const updateData = { ...this.usuarioForm };
    if (!updateData.password) {
      delete updateData.password;
    }

    this.userService.updateUser(this.usuarioForm.id, updateData).subscribe(
      (data) => {
        this.getAllUsers();  
        this.closeModal();
        this.resetForm();
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = error.error.message || 'Error al actualizar el usuario';
      }
    );
  }

  deleteUser(id: number): void {
    if (id === this.loggedUserId) {
      this.errorMessage = 'No puedes eliminar tu propio perfil';
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.getAllUsers(); 
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = error.error.message || 'Hubo un error al eliminar el usuario';
        }
      );
    }
  }

  resetErrors(): void {
    this.passwordError = '';
    this.usernameError = '';
    this.roleError = '';
    this.errorMessage = '';
  }

  resetForm(): void {
    this.usuarioForm = { id: null, username: '', password: '', role: '' };
    this.isEditing = false;
    this.resetErrors();
  }

  openModal(): void {
    this.resetForm();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }
}