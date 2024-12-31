import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CryptoService } from '../../crypto.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cryptos: any[] = [];
  errorMessage: string = '';

  constructor(private router: Router, private cryptoService: CryptoService , private authService: AuthService) {}
  
  ngOnInit(): void {
    this.fetchCryptos();
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  actualizar(){
    this.fetchCryptos();
  }
  
  fetchCryptos() {
    this.cryptoService.getCryptos().subscribe({
      next: (data) => {
        this.cryptos = data;
      },
      error: (error) => {
        console.error('Error al cargar criptomonedas:', error);
        this.errorMessage = 'No se pudieron cargar las criptomonedas.';
      }
    });
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
