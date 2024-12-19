import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();


router.get('/:user_id', authenticate, authorize(['Admin', 'User']), portfolioController.getUserPortfolio); 
router.get('/user/:user_id', authenticate, authorize(['Admin']), portfolioController.getAllUserPortfolios);


router.post('/create', authenticate, authorize(['Admin', 'User']), portfolioController.createPortfolio); 
router.delete('/delete/:portfolio_id', authenticate, authorize(['Admin']), portfolioController.deletePortfolio); 


router.post('/add-crypto', authenticate, authorize(['Admin', 'User']), portfolioController.addCryptoToPortfolio); 
router.delete('/remove-crypto/:portfolio_id/:crypto_id', authenticate, authorize(['Admin', 'User']), portfolioController.removeCryptoFromPortfolio); 


router.get('/balance/:user_id', authenticate, authorize(['Admin', 'User']), portfolioController.getPortfolioBalanceForUser); 


export default router;
