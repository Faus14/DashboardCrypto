import { Request, Response } from 'express';
import { createPortfolioCrypto, getPortfolioByUserId, getPortfolioBalance, createPortfolios, deletePortfolioCrypto,deletePortfolios} from '../services/portfolio.service';

// Obtener el portafolio de un usuario
export const getUserPortfolio = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const portfolio = await getPortfolioByUserId(parseInt(user_id));
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el portafolio', error: err });
  }
};

// Obtener el balance total del portafolio de un usuario
export const getPortfolioBalanceForUser = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const balance = await getPortfolioBalance(parseInt(user_id));
    res.status(200).json({ balance });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el balance', error: err });
  }
};

// Agregar una criptomoneda al portafolio de un usuario
export const addCryptoToPortfolio = async (req: Request, res: Response) => {
  const { portfolio_id, crypto_id, quantity } = req.body;

  try {
    const portfolio = await createPortfolioCrypto(portfolio_id, crypto_id, quantity);
    res.status(201).json({ message: 'Criptomoneda agregada al portafolio', portfolio });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar criptomoneda al portafolio', error: err });
  }
};

export const createPortfolio = async (req: Request, res: Response) => {
  const { user_id, portfolio_name } = req.body;

  try {
    const portfolio = await createPortfolios(user_id, portfolio_name);
    res.status(201).json({ message: 'Portafolio creado', portfolio });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el portafolio', error: err });
  }
}

export const getAllUserPortfolios = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const portfolios = await getPortfolioByUserId(parseInt(user_id));
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los portafolios', error: err });
  }
}

export const deletePortfolio = async (req: Request, res: Response) => {
  const { portfolio_id } = req.params;

  try {
    const { user_id } = req.body;
    await deletePortfolios(parseInt(portfolio_id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el portafolio', error: err });
  }
}

export const removeCryptoFromPortfolio = async (req: Request, res: Response) => {
  const { portfolio_id, crypto_id } = req.params;

  try {

    await deletePortfolioCrypto(parseInt(portfolio_id), parseInt(crypto_id));
    res.status(204).send(); 
  } catch (err) {
    if (err instanceof Error && err.message === 'No se encontró la criptomoneda en el portafolio') {
      res.status(404).json({ message: 'La criptomoneda no se encuentra en el portafolio' });
    } else {
      res.status(500).json({ message: 'Error al eliminar la criptomoneda del portafolio', error: err });
    }
  }
};