import { Request, Response } from 'express';
import { createPortfolios,deletePortfolios,getPortfolios,getTotalBalance,getPortfolioByIdService } from '../services/portfolio.service';


export const createPortfolio = async (req: Request, res: Response) => {
  const { user_id, portfolio_name } = req.body;

  try {
    const portfolio = await createPortfolios(user_id, portfolio_name);
    res.status(201).json({ message: 'Portafolio creado', portfolio });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el portafolio', error: err });
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

export const getUserPortfolios = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const portfolios = await getPortfolios(parseInt(user_id));
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los portafolios', error: err });
  }
}

export const getPortfolioById = async (req: Request, res: Response) => {
  const { portfolio_id } = req.params;

  try {
    const portfolio = await getPortfolioByIdService(parseInt(portfolio_id));
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el portafolio', error: err });
  }
}


export const getTotalPortfolioBalance = async (req: Request, res: Response) => {
  const { portfolio_id } = req.params;

  try {
    const balance = await getTotalBalance(parseInt(portfolio_id));
    res.status(200).json({ balance });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el balance total del portafolio', error: err });
  }
}


