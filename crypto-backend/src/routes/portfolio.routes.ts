import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/:user_id',authenticate, authorize(['Admin', 'User']),portfolioController.getUserPortfolios);
router.get('/portfolio/:portfolio_id',authenticate, authorize(['Admin', 'User']),portfolioController.getPortfolioById);
router.post('/create',authenticate, authorize(['Admin', 'User']),portfolioController.createPortfolio);
router.delete('/delete/:portfolio_id',authenticate, authorize(['Admin', 'User']),portfolioController.deletePortfolio);
router.get('/total/:portfolio_id',authenticate, authorize(['Admin', 'User']),portfolioController.getTotalPortfolioBalance);

export default router;
