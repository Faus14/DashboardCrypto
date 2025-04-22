import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transaction`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getTransactions(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  getPortfolioTransactions(portfolioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/portfolio/${portfolioId}`, { headers: this.getAuthHeaders() });
  }

  getPortfolioCryptos(portfolioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/monedas/${portfolioId}`, { headers: this.getAuthHeaders() });
  }

  addCryptoToPortfolio(portfolioId: number, cryptoId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { portfolio_id: portfolioId, crypto_id: cryptoId, quantity: quantity }, { headers: this.getAuthHeaders() });
  }
  

  removeCryptoFromPortfolio(portfolioId: number, cryptoId: number, quantity: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove`, {
      body: { portfolio_id: portfolioId, crypto_id: cryptoId , quantity: quantity}, headers: this.getAuthHeaders()
    });
  }
  
}
