import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private apiUrl = `${environment.apiUrl}/portfolios`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUserPortfolio(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  getTotalPortfolioBalance(portfolio_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/total/${portfolio_id}`, { headers: this.getAuthHeaders() });
  }

  createPortfolio(userId: number, portfolioName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, { user_id: userId, portfolio_name: portfolioName }, { headers: this.getAuthHeaders() });
  }

  deletePortfolio(portfolioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${portfolioId}`, { headers: this.getAuthHeaders() });
  }
  

  
}
