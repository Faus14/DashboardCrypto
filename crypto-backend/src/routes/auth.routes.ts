import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Rutas de autenticación
// Ruta para el registro de usuarios
router.post('/register', authController.register);

router.post('/', authController.login);

export default router;
