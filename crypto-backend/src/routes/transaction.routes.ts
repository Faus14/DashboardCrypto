import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();


// Obtener todas las transacciones de un portafoio
router.get('/portfolio/:portfolio_id',transactionController.getPortfolioTransactions);


//ver todas las monedas del portafolio
router.get('/monedas/:portfolio_id',transactionController.getPortfolioCryptos);

// Agregar criptomoneda a un portafolio
router.post('/add', transactionController.addCryptoToPortfolio);

// Quitar criptomoneda de un portafolio
router.delete('/remove',transactionController.removeCryptoFromPortfolio);



export default router;
