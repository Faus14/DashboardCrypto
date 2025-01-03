import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/portfolio/:portfolio_id',authenticate, authorize(['Admin', 'User']),transactionController.getPortfolioTransactions);
router.get('/monedas/:portfolio_id',authenticate, authorize(['Admin', 'User']),transactionController.getPortfolioCryptos);
router.post('/add',authenticate, authorize(['Admin', 'User']), transactionController.addCryptoToPortfolio);
router.delete('/remove',authenticate, authorize(['Admin', 'User']),transactionController.removeCryptoFromPortfolio);



export default router;
