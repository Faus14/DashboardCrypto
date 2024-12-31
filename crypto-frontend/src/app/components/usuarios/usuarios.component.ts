import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';

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
  loggedUserId: number | null = null;  // Guardamos el ID del usuario logueado

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Suponiendo que el ID del usuario logueado está en el localStorage
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.loggedUserId = JSON.parse(loggedUser).id;
    }
    this.getAllUsers();
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
    if (this.usuarioForm.username && this.usuarioForm.password && this.usuarioForm.role) {
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
  }

  editUser(user: any): void {
    this.isEditing = true;
    this.usuarioForm = { ...user };
    this.isModalOpen = true;
  }

  updateUser(): void {
    if (this.usuarioForm.username && this.usuarioForm.password && this.usuarioForm.role) {
      this.userService.updateUser(this.usuarioForm.id, this.usuarioForm).subscribe(
        (data) => {
          this.getAllUsers();  
          this.resetForm();
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = error.error.message || 'Error al actualizar el usuario';
        }
      );
    }
  }

  deleteUser(id: number): void {
    if (id === this.loggedUserId) {
      alert('No puedes eliminar tu propio perfil');
      return; // Evitamos la eliminación
    }

    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.getAllUsers(); 
        },
        (error) => {
          this.errorMessage = error.error.message || 'Hubo un error al eliminar el usuario';
        }
      );
    }
  }

  resetForm(): void {
    this.usuarioForm = { id: null, username: '', password: '', role: '' };
    this.isEditing = false;
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
