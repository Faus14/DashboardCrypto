export interface Transaction {
    id?: number;
    portfolio_id: number;        // Relación con el Portafolio
    crypto_id: number;           // Relación con la Criptomoneda
    quantity: number;            // Cantidad de criptomonedas
    transaction_type: 'add' | 'remove'; // Tipo de transacción
    transaction_date: Date;      // Fecha de la transacción
  }