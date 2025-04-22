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

  getUSDTPrice(): Observable<number> {
    return this.http.get<any>(`${this.priceApiUrl}/usdt/ars/1`).pipe(
      map(response => {
        if (!response || typeof response !== 'object') {
          return 0;
        }
  
        const prices = Object.values(response)
          .map((exchange: any) => exchange?.ask)
          .filter((ask: number) => ask > 0);
  
        if (prices.length === 0) {
          return 0;
        }
  
        const avgPrice = prices.reduce((acc, price) => acc + price, 0) / prices.length;
        return avgPrice;
      }),
      catchError((error) => {
        console.error('Error al obtener precio de USDT:', error);
        return of(0);
      })
    );
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

