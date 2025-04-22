import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import bcrypt from 'bcrypt';

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


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Faltan campos obligatorios: username o password' });
      return;
    }

    if (password.trim() === '') {
      res.status(400).json({ message: 'La contraseña no puede estar vacía' });
      return;
    }

    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: 'El usuario ya existe' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userService.createUser({
      username,
      password_hash: hashedPassword,
      role: 'User' as 'user'
    });

    const { password_hash, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (!res.headersSent) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: 'Error al registrar usuario', error: errorMessage });
    }
  }
};