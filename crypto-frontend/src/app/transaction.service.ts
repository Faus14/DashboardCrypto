import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:3000/transaction'; // URL de la API

  constructor(private http: HttpClient) {}

  // Obtener todas las transacciones de un usuario
  getTransactions(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  getPortfolioTransactions(portfolioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/portfolio/${portfolioId}`);
  }


  // Obtener las criptomonedas de un portafolio
  getPortfolioCryptos(portfolioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/monedas/${portfolioId}`);
  }

  addCryptoToPortfolio(portfolioId: number, cryptoId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { portfolio_id: portfolioId, crypto_id: cryptoId, quantity: quantity });
  }
  

  removeCryptoFromPortfolio(portfolioId: number, cryptoId: number, quantity: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove`, {
      body: { portfolio_id: portfolioId, crypto_id: cryptoId , quantity: quantity}
    });
  }
  
}