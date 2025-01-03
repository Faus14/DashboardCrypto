export interface Transaction {
    id?: number;
    portfolio_id: number;        
    crypto_id: number;          
    quantity: number;           
    transaction_type: 'add' | 'remove'; 
    transaction_date: Date;  
  }