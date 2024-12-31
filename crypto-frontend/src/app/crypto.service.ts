import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private apiUrl = 'http://localhost:3000/cryptos';
  private priceApiUrl = 'https://criptoya.com/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getCryptos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      mergeMap(cryptos => {
        const cryptosWithPrice$ = cryptos.map(crypto => {
          return this.getCryptoPrice(crypto.symbol).pipe(
            map(price => ({
              ...crypto,
              price: price || 0,
            })),
            catchError(() => of({ ...crypto, price: 0 })) 
          );
        });
        return forkJoin(cryptosWithPrice$);  
      })
    );
  }

  getCryptoPrice(symbol: string): Observable<number> {
    return this.http.get<any>(`${this.priceApiUrl}/${symbol}/ARS/1`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response?.satoshitango?.ask || 0),
      catchError(() => of(0)) 
    );
  }

  createCrypto(crypto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, crypto, { headers: this.getAuthHeaders() });
  }

  updateCrypto(id: number, crypto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, crypto, { headers: this.getAuthHeaders() });
  }

  deleteCrypto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getSelectedCrypto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getallCryptos(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }
}

