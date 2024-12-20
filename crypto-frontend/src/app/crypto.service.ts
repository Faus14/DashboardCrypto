import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getCryptos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
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
    return this.http.get<any>(`${this.priceApiUrl}/${symbol}/ARS/1`).pipe(
      map(response => response?.satoshitango?.ask || 0),
      catchError(() => of(0)) 
    );
  }

  createCrypto(crypto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, crypto);
  }

  updateCrypto(id: number, crypto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, crypto);
  }

  deleteCrypto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getSelectedCrypto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  
  
}
