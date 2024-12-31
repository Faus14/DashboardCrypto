import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();


// Obtener todas las transacciones de un portafoio
router.get('/portfolio/:portfolio_id',authenticate, authorize(['Admin', 'User']),transactionController.getPortfolioTransactions);


//ver todas las monedas del portafolio
router.get('/monedas/:portfolio_id',authenticate, authorize(['Admin', 'User']),transactionController.getPortfolioCryptos);

// Agregar criptomoneda a un portafolio
router.post('/add',authenticate, authorize(['Admin', 'User']), transactionController.addCryptoToPortfolio);

// Quitar criptomoneda de un portafolio
router.delete('/remove',authenticate, authorize(['Admin', 'User']),transactionController.removeCryptoFromPortfolio);



export default router;
