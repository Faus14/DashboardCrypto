import { Router } from 'express';
import * as cryptoController from '../controllers/crypto.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();



router.get('/',authenticate, authorize(['Admin', 'User']),cryptoController.getCryptos);
router.get('/:id',authenticate, authorize(['Admin', 'User']),cryptoController.getCryptoById);


router.post('/',authenticate, authorize(['Admin']),cryptoController.createCrypto);
router.put('/:id',authenticate, authorize(['Admin']),cryptoController.updateCrypto);
router.delete('/:id',authenticate, authorize(['Admin']),cryptoController.deleteCrypto);


export default router;

