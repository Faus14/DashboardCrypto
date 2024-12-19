export interface Portfolio {
  portfolio_id?: number;
  user_id: number;
  portfolio_name: string;
}

export interface PortfolioCrypto {
  id?: number;
  portfolio_id: number;
  crypto_id: number;
  quantity: number;
}
  