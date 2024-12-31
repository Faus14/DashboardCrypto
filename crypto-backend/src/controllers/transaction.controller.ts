import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service';

// Obtener todas las transacciones de un portafolio
export const getPortfolioTransactions = async (req: Request, res: Response) => {
  try {
    const { portfolio_id } = req.params;
    const transactions = await transactionService.getporfolioTransactions(Number(portfolio_id));
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message:
      'Error al buscar transacciones', error: err });
  }
};

// Ver todas las monedas del portafolio
export const getPortfolioCryptos = async (req: Request, res: Response) => {
  try {
    const { portfolio_id } = req.params;
    const cryptos = await transactionService.getPortfolioCryptos(Number(portfolio_id));
    res.status(200).json(cryptos);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar transaccion', error: err });
  }
};

// Agregar criptomoneda a un portafolio(COMPRAR)
export const addCryptoToPortfolio = async (req: Request, res: Response) => {
  try {
    const { portfolio_id, crypto_id, quantity } = req.body;
    const transaction = await transactionService.addCryptoToPortfolio({
      portfolio_id,
      crypto_id,
      quantity,
      transaction_type: 'add',
      transaction_date: new Date(),
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar transaccion', error: err });
  }
};

// Quitar criptomoneda de un portafolio (VENDER)
export const removeCryptoFromPortfolio = async (req: Request, res: Response) => {
  try {
    const { portfolio_id, crypto_id, quantity } = req.body;

    const result = await transactionService.removeCryptoFromPortfolio(Number(portfolio_id), Number(crypto_id), quantity);

    if (result.error) {
      return res.status(400).json({ message: result.message, available_quantity: result.available_quantity });
    }

    // Responder con éxito si no hay error
    return res.status(200).json(result);
    
  } catch (err) {
    console.error('Error en el controlador:', err);
    res.status(500).json({ message: 'Error al vender criptomoneda', error: err });
  }
};


