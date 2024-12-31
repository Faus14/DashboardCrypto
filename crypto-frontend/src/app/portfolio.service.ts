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

  getTotalPortfolioBalance(portfolio_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/total/${portfolio_id}`);
  }

  createPortfolio(userId: number, portfolioName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, { user_id: userId, portfolio_name: portfolioName });
  }

  deletePortfolio(portfolioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${portfolioId}`);
  }
  

  
}
