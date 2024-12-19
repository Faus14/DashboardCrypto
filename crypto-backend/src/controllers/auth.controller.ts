import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Faltan campos obligatorios: username o password' });
    return;
  }

  try {
    const { token, user } = await authService.login(username, password);

    res.status(200).json({ message: 'Login exitoso', token, user });
  } catch (error) {
    console.error('Error en el login:', error);
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: 'Unknown error' });
    }
  }
};

