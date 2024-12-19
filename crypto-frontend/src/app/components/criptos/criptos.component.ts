// criptos.component.ts
import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../crypto.service';

@Component({
  selector: 'app-criptos',
  templateUrl: './criptos.component.html',
  styleUrls: ['./criptos.component.css'],
})
export class CriptosComponent implements OnInit {
  cryptos: any[] = [];
  selectedCrypto: any = null;
  newCrypto: any = { name: '', symbol: '' };

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.getCryptos();
  }

  getCryptos(): void {
    this.cryptoService.getCryptos().subscribe(
      (data) => {
        this.cryptos = data;
      },
      (error) => {
        console.error('Error al obtener las criptomonedas', error);
      }
    );
  }

}
