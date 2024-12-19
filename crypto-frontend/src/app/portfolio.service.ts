import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private apiUrl = 'http://localhost:3000/portfolio';

  constructor(private http: HttpClient) { }

  getUserPortfolio(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  getPortfolioBalance(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/balance/${userId}`);
  }

  createPortfolio(userId: number, portfolioName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, { user_id: userId, portfolio_name: portfolioName });
  }

  addCryptoToPortfolio(portfolioId: number, cryptoId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-crypto`, { portfolio_id: portfolioId, crypto_id: cryptoId, quantity: quantity });
  }

  removeCryptoFromPortfolio(portfolioId: number, cryptoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-crypto/${portfolioId}/${cryptoId}`);
  }
}
