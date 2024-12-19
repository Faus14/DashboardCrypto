import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';


const router = Router();


router.get('/', authenticate,authorize(['Admin']) ,userController.getAllUsers);
router.get('/:id', authenticate, authorize(['Admin']), userController.getUserById);
router.post('/', authenticate, authorize(['Admin']), userController.createUser);
router.put('/:id', authenticate, authorize(['Admin']), userController.updateUser);
router.delete('/:id', authenticate, authorize(['Admin']), userController.deleteUser);


export default router;
