import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();


// Obtener todos los portafolios de un usuario
router.get('/:user_id',authenticate, authorize(['Admin', 'User']),portfolioController.getUserPortfolios);

// Obtener un portafolio por su id
router.get('/portfolio/:portfolio_id',authenticate, authorize(['Admin', 'User']),portfolioController.getPortfolioById);

// Crear un nuevo portafolio
router.post('/create',authenticate, authorize(['Admin', 'User']),portfolioController.createPortfolio);

// Eliminar un portafolio
router.delete('/delete/:portfolio_id',authenticate, authorize(['Admin', 'User']),portfolioController.deletePortfolio);

// Ver el balance total de un portafolio
router.get('/total/:portfolio_id',authenticate, authorize(['Admin', 'User']),portfolioController.getTotalPortfolioBalance);

export default router;
