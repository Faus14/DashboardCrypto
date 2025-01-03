import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../crypto.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-criptos',
  templateUrl: './criptos.component.html',
  styleUrls: ['./criptos.component.css'],
})
export class CriptosComponent implements OnInit {
  cryptos: any[] = [];
  selectedCrypto: any = null;
  newCrypto: any = { name: '', symbol: '' };
  isModalOpen: boolean = false;
  errorMessage: string = ''; 
  router: any;

  constructor(private cryptoService: CryptoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAuthorization();
    this.getCryptos();
  }

  checkAuthorization(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/unauthorized']);
    }
  }

  getCryptos(): void {
    this.cryptoService.getCryptos().subscribe({
      next: (data) => {
        this.cryptos = data;
      },
      error: (error) => {
        console.error('Error al obtener las criptomonedas', error);
      }
    });
  }

  createCrypto(): void {
    if (!this.newCrypto.name.trim() || !this.newCrypto.symbol.trim()) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }
  
    this.cryptoService.createCrypto(this.newCrypto).subscribe({
      next: (response) => {
        if (response.errorMessage) {
          this.errorMessage = response.errorMessage; // Mostramos el mensaje de error
        } else {
          this.getCryptos();
          this.closeModal();
          this.errorMessage = '';  // Limpiar el mensaje de error después de un éxito
        }
      },
      error: (error) => {
        console.error('Error al crear la criptomoneda', error);
        this.errorMessage = 'Error al crear la criptomoneda, ya esta creada';
      }
    });
  }
  

  updateCrypto(): void {
    if (!this.selectedCrypto?.crypto_id) return;

    if (!this.selectedCrypto.name.trim() || !this.selectedCrypto.symbol.trim()) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    this.cryptoService.updateCrypto(this.selectedCrypto.crypto_id, this.selectedCrypto).subscribe({
      next: () => {
        this.getCryptos();
        this.closeModal();
        this.errorMessage = ''; 
      },
      error: (error) => {
        console.error('Error al actualizar la criptomoneda', error);
      }
    });
  }

  deleteCrypto(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta criptomoneda?')) {
      this.cryptoService.deleteCrypto(id).subscribe({
        next: () => {
          this.getCryptos();
        },
        error: (error) => {
          console.error('Error al eliminar la criptomoneda', error);
        }
      });
    }
  }

  selectCrypto(crypto: any): void {
    this.selectedCrypto = { ...crypto };
    this.isModalOpen = true;
    this.errorMessage = '';
  }

  openModal(): void {
    this.selectedCrypto = null;
    this.newCrypto = { name: '', symbol: '' };
    this.isModalOpen = true;
    this.errorMessage = ''; 
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCrypto = null;
    this.newCrypto = { name: '', symbol: '' };
    this.errorMessage = ''; 
  }

  onSubmit(): void {
    if (this.selectedCrypto) {
      this.updateCrypto();
    } else {
      this.createCrypto();
    }
  }
}
