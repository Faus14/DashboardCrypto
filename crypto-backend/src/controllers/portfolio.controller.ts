import { Request, Response } from 'express';
import { createPortfolios, deletePortfolios, getPortfolios, getTotalBalance, getPortfolioByIdService } from '../services/portfolio.service';

export const createPortfolio = async (req: Request, res: Response) => {
  const { portfolio_name } = req.body;

  try {
    const userId = req.user!.userId;

    const portfolio = await createPortfolios(userId, portfolio_name);

    res.status(201).json({ message: 'Portafolio creado', portfolio });
  } catch (err) {
    console.error('Error al crear el portafolio:', err);
    res.status(500).json({ message: 'Error al crear el portafolio', error: err });
  }
};

export const deletePortfolio = async (req: Request, res: Response) => {
  const { portfolio_id } = req.params;

  try {
    await deletePortfolios(parseInt(portfolio_id));
    res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar el portafolio:', err);
    res.status(500).json({ message: 'Error al eliminar el portafolio', error: err });
  }
};

export const getUserPortfolios = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const portfolios = await getPortfolios(userId);

    res.status(200).json(portfolios);
  } catch (err) {
    console.error('Error al obtener los portafolios:', err);
    res.status(500).json({ message: 'Error al obtener los portafolios', error: err });
  }
};

export const getPortfolioById = async (req: Request, res: Response) => {
  const { portfolio_id } = req.params;

  try {
    const portfolio = await getPortfolioByIdService(parseInt(portfolio_id));
    res.status(200).json(portfolio);
  } catch (err) {
    console.error('Error al obtener el portafolio:', err);
    res.status(500).json({ message: 'Error al obtener el portafolio', error: err });
  }
};

export const getTotalPortfolioBalance = async (req: Request, res: Response) => {
  const { portfolio_id } = req.params;

  try {
    const balance = await getTotalBalance(parseInt(portfolio_id));
    res.status(200).json({ balance });
  } catch (err) {
    console.error('Error al obtener el balance total del portafolio:', err);
    res.status(500).json({ message: 'Error al obtener el balance total del portafolio', error: err });
  }
};
