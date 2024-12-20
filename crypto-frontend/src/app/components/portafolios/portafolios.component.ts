
import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../portfolio.service';

@Component({
  selector: 'app-portafolios',
  templateUrl: './portafolios.component.html',
  styleUrls: ['./portafolios.component.css']
})
export class PortfolioComponent implements OnInit {

  userId = 1;
  portfolios = [];
  portfolioBalance: number = 0;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit(): void {
    this.getUserPortfolios();
    this.getPortfolioBalance();
  }

  // Obtener todos los portafolios del usuario
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

  // Obtener el balance total de los portafolios del usuario
  getPortfolioBalance(): void {
    this.portfolioService.getPortfolioBalance(this.userId).subscribe(
      (data) => {
        this.portfolioBalance = data.balance;
      },
      (error) => {
        console.error('Error fetching portfolio balance:', error);
      }
    );
  }

  // Crear un nuevo portafolio
  createPortfolio(portfolioName: string): void {
    this.portfolioService.createPortfolio(this.userId, portfolioName).subscribe(
      (data) => {
        console.log('Portfolio created:', data);
        this.getUserPortfolios(); // Actualizar la lista de portafolios
      },
      (error) => {
        console.error('Error creating portfolio:', error);
      }
    );
  }

  // Agregar una criptomoneda a un portafolio
  addCryptoToPortfolio(portfolioId: number, cryptoId: number, quantity: number): void {
    this.portfolioService.addCryptoToPortfolio(portfolioId, cryptoId, quantity).subscribe(
      (data) => {
        console.log('Crypto added to portfolio:', data);
        this.getUserPortfolios(); // Actualizar la lista de portafolios
      },
      (error) => {
        console.error('Error adding crypto to portfolio:', error);
      }
    );
  }

  // Eliminar una criptomoneda de un portafolio
  removeCryptoFromPortfolio(portfolioId: number, cryptoId: number): void {
    this.portfolioService.removeCryptoFromPortfolio(portfolioId, cryptoId).subscribe(
      (data) => {
        console.log('Crypto removed from portfolio:', data);
        this.getUserPortfolios(); // Actualizar la lista de portafolios
      },
      (error) => {
        console.error('Error removing crypto from portfolio:', error);
      }
    );
  }
}
