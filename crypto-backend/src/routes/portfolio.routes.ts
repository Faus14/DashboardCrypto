import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();


router.get('/:user_id', portfolioController.getUserPortfolio); 
router.get('/user/:user_id',portfolioController.getAllUserPortfolios);


router.post('/create',portfolioController.createPortfolio); 
router.delete('/delete/:portfolio_id',portfolioController.deletePortfolio); 


router.post('/add-crypto',portfolioController.addCryptoToPortfolio); 
router.delete('/remove-crypto/:portfolio_id/:crypto_id',portfolioController.removeCryptoFromPortfolio); 


router.get('/balance/:user_id', portfolioController.getPortfolioBalanceForUser); 


export default router;
