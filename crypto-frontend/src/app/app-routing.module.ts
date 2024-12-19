import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CriptosComponent } from './components/criptos/criptos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AuthGuard } from './auth.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
//import { PortafoliosComponent } from './components/portafolios/portafolios.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { 
    path: 'dashboard', 
    component: LayoutComponent,
    children: [{ path: '', component: DashboardComponent }],
    canActivate: [AuthGuard]
  },

  { 
    path: 'criptos', 
    component: LayoutComponent,
    children: [{ path: '', component: CriptosComponent }],
    canActivate: [AuthGuard], 
    data: { role: 'Admin' } // Solo administradores pueden acceder
  },

  { 
    path: 'usuarios', 
    component: LayoutComponent,
    children: [{ path: '', component: UsuariosComponent }],
    canActivate: [AuthGuard], 
    data: { role: 'Admin' } // Solo administradores pueden acceder
  },

  {path: 'unauthorized', component: UnauthorizedComponent},
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
