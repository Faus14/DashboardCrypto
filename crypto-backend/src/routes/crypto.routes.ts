import { Router } from 'express';
import * as cryptoController from '../controllers/crypto.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();



router.get('/',authenticate, authorize(['Admin', 'User']),cryptoController.getCryptos);
router.get('/:id',cryptoController.getCryptoById);


router.post('/',cryptoController.createCrypto);
router.put('/:id',cryptoController.updateCrypto);
router.delete('/:id',cryptoController.deleteCrypto);


export default router;


// authenticate, authorize(['Admin']), 
// authenticate, authorize(['Admin', 'User']), 