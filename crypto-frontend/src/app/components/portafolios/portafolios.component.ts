import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../portfolio.service';
import { TransactionService } from '../../transaction.service';
import { CryptoService } from '../../crypto.service';

@Component({
  selector: 'app-portafolios',
  templateUrl: './portafolios.component.html',
  styleUrls: ['./portafolios.component.css'],
})
export class PortfolioComponent implements OnInit {
  loggedUser: any;
  userId: number = 0;
  portfolios: any[] = [];
  cryptoid: number = 0;
  portfolioBalance: number = 0;
  selectedPortfolioId: number = 0;
  transactions: any[] = [];
  Cryptos: any[] = [];
  TodasCryptos: any[] = [];
  selectedPortfolioName: string = '';
  selectedCryptoId: number = 0;
  quantity: number = 0;
  action: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  newPortfolioName: string = '';
  portfolioToDelete: number | null = null;
  


  constructor(
    private portfolioService: PortfolioService,
    private transactionService: TransactionService,
    private criptoService: CryptoService,
  ) {}

  ngOnInit(): void {
    const localUser = localStorage.getItem('loggedUser');
    if (localUser) {
      this.loggedUser = JSON.parse(localUser);
      this.userId = this.loggedUser?.id;

      
      if (this.userId > 0) {
        this.getUserPortfolios();
      }
    }
    this.getallcryptos();
  }

  getUserPortfolios(): void {
    this.portfolioService.getUserPortfolio(this.userId).subscribe(
      (data) => {
        this.portfolios = data;
      },
      (error) => {
        console.error('Error fetching portfolios:', error);
      }
    );
  }

  getPortfolioBalance(): void {
    console.log('selectedPortfolioId:', this.selectedPortfolioId);  // Agregar un log para verificar el valor de selectedPortfolioId
  
    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getTotalPortfolioBalance(this.selectedPortfolioId).subscribe(
        (data) => {
          this.portfolioBalance = data.balance;
          console.log('Balance del portafolio:', this.portfolioBalance);  // Verifica que el balance sea recibido correctamente
        },
        (error) => {
          console.error('Error fetching portfolio balance:', error);
        }
      );
    } else {
      console.error('No portfolio selected!');
    }
  }
  
  

  // Método para seleccionar un portafolio y obtener sus transacciones
  selectPortfolio(portfolioId: number): void {
    this.selectedPortfolioId = portfolioId;
    console.log('Portafolio seleccionado:', portfolioId);
  
    // Buscar el nombre del portafolio seleccionado y actualizar la variable
    
    const selectedPortfolio = this.portfolios.find((p) => p.portfolio_id === portfolioId);
    this.selectedPortfolioName = selectedPortfolio?.portfolio_name || 'Desconocido';
    
    // Llamar a los métodos para obtener balance y transacciones
    this.getPortfolioTransactions(portfolioId);
    this.getPortfolioBalance();
    this.getCryptoPorfolio(portfolioId);
  }
  

  getPortfolioTransactions(portfolioId: number): void {
    this.transactionService.getPortfolioTransactions(portfolioId).subscribe(
      (data) => {
        this.transactions = data;
        console.log('Transacciones del portafolio:', data);
        this.updateCryptoNames();
      },
      (error) => {
        console.error('Error al obtener transacciones del portafolio:', error);
      }
    );
  }

   // Método para obtener el nombre de la cripto basado en el crypto_id
   updateCryptoNames(): void {
    this.transactions.forEach((transaction) => {
      if (transaction.crypto_id) {
        this.criptoService.getSelectedCrypto(transaction.crypto_id).subscribe(
          (cryptoData) => {
            transaction.crypto_name = cryptoData.name; // Agrega el nombre a la transacción
            console.log(`Nombre de la cripto: ${cryptoData.name}`); // Verifica que se esté asignando correctamente
          },
          (error) => {
            console.error('Error obteniendo datos de la cripto:', error);
          }
        );
      }
    });
  }
  

  getTransactionCryptoName(transaction: any): string {
    return transaction.crypto_name || '';
  }

  getPortfolioName(portfolioId: number): string {
    this.selectedPortfolioId = portfolioId; 
    const portfolio = this.portfolios.find((p) => p.portfolio_id === portfolioId);
    return portfolio?.name || '';
  }

  getCryptoPorfolio(portfolioId: number): void {
    this.transactionService.getPortfolioCryptos(portfolioId).subscribe(
      (data) => {
        console.log('Criptomonedas del portafolio:', data);
        this.Cryptos = data;
      },
      (error) => {
        console.error('Error al obtener criptos del portafolio:', error);
      }
    );
  }

  handleCryptoAction(): void {
    if (this.action === 'add') {
      this.addCryptoToPortfolio();
      this.showNotification('Operación exitosa', 'success');
    } else if (this.action === 'remove') {
      this.removeCryptoFromPortfolio(this.selectedCryptoId);
      this.showNotification('Error en la operación', 'error');
    } else {
      console.error('Acción no definida');
    }
  }
  

  setAction(action: string): void {
    this.action = action;
  }
  
  addCryptoToPortfolio(): void {
    const portfolio_id = this.selectedPortfolioId;
    const quantity = this.quantity;  // Usar la cantidad seleccionada
    this.transactionService.addCryptoToPortfolio(portfolio_id, this.selectedCryptoId, quantity).subscribe(
      (data) => {
        console.log('Cripto agregada al portafolio:', data);
        this.getCryptoPorfolio(portfolio_id);
        this.getPortfolioTransactions(portfolio_id);
        this.successMessage= 'Cripto agregada del portafolio';
        this.getPortfolioBalance();

      },
      (error) => {
        console.error('Error al agregar cripto al portafolio:', error);
      }
    );
  }


removeCryptoFromPortfolio(crypto_id: number): void {
  const portfolio_id = this.selectedPortfolioId;
  const quantity = this.quantity;
  
  this.errorMessage = '';

  this.transactionService.removeCryptoFromPortfolio(portfolio_id, crypto_id, quantity).subscribe(
    (data) => {
      console.log('Cripto removida del portafolio:', data);
      this.getCryptoPorfolio(portfolio_id);
      this.getPortfolioTransactions(portfolio_id);
      this.successMessage= 'Cripto removida del portafolio';
      this.getPortfolioBalance();
    },
    (error) => {
      console.error('Se produjo un error al remover la criptomoneda:La cantidad solicitada es mayor a la cantidad disponible:', error);
      this.errorMessage = 'Se produjo un error al remover la criptomoneda, La cantidad solicitada es mayor a la cantidad disponible';
    }
  );
}

  

  getallcryptos(): void {
    this.criptoService.getallCryptos().subscribe(
      (data) => {
        console.log('Todas las criptos:', data);
        this.TodasCryptos = data;
      },
      (error) => {
        console.error('Error al obtener todas las criptos:', error);
      }
    );
  }
  showNotification(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => this.successMessage = '', 3000);
    } else {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = '', 3000);
    }
  }

  createNewPortfolio() {
    const modal = document.getElementById('createModal') as HTMLDialogElement;
    modal.showModal();
  }

  confirmCreatePortfolio() {
    if (this.newPortfolioName.trim()) {
      this.portfolioService.createPortfolio(this.userId, this.newPortfolioName.trim()).subscribe({
        next: () => {
          const modal = document.getElementById('createModal') as HTMLDialogElement;
          modal.close();
          this.newPortfolioName = '';
          this.showSuccess('Portafolio creado exitosamente');
          this.getUserPortfolios();
        },
        error: (err) => {
          console.error('Error al crear el portafolio:', err);
        }
      });
    }
  }

  deletePortfolio(portfolioId: number) {
    this.portfolioToDelete = portfolioId;
    const modal = document.getElementById('deleteModal') as HTMLDialogElement;
    modal.showModal();
  }

  confirmDelete() {
    if (this.portfolioToDelete) {
      this.portfolioService.deletePortfolio(this.portfolioToDelete).subscribe({
        next: () => {
          const modal = document.getElementById('deleteModal') as HTMLDialogElement;
          modal.close();
          this.portfolioToDelete = null;
          this.showSuccess('Portafolio eliminado exitosamente');
          this.getUserPortfolios()
        },
        error: (err) => {
          console.error('Error al eliminar el portafolio:', err);
        }
      });
    }
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3000);
  }
    
  
}
