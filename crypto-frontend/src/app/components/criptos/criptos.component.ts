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

  createCrypto(): void {
    this.cryptoService.createCrypto(this.newCrypto).subscribe(
      (data) => {
        this.cryptos.push(data);
        this.newCrypto = { name: '', symbol: '' };
      },
      (error) => {
        console.error('Error al crear la criptomoneda', error);
      }
    );
  }

  updateCrypto(): void {
    this.cryptoService.updateCrypto(this.selectedCrypto.crypto_id, this.selectedCrypto).subscribe(
      (data) => {
        const index = this.cryptos.findIndex((crypto) => crypto.crypto_id === data.crypto_id);
        this.cryptos[index] = data;
      },
      (error) => {
        console.error('Error al actualizar la criptomoneda', error);
      }
    );
  }

  deleteCrypto(id: number): void {
    this.cryptoService.deleteCrypto(id).subscribe(
      () => {
        this.cryptos = this.cryptos.filter((crypto) => crypto.crypto_id !== id);
      },
      (error) => {
        console.error('Error al eliminar la criptomoneda', error);
      }
    );
  }

  selectCrypto(crypto: any): void {
    this.selectedCrypto = { ...crypto };
  }

}
