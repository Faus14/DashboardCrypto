import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();


// Obtener todos los portafolios de un usuario
router.get('/:user_id',portfolioController.getUserPortfolios);

// Obtener un portafolio por su id
router.get('/portfolio/:portfolio_id',portfolioController.getPortfolioById);

// Crear un nuevo portafolio
router.post('/create',portfolioController.createPortfolio);

// Eliminar un portafolio
router.delete('/delete/:portfolio_id',portfolioController.deletePortfolio);

// Ver el balance total de un portafolio
router.get('/total/:portfolio_id',portfolioController.getTotalPortfolioBalance);

export default router;
