import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsers();

    const usersWithoutPassword = users.map(({ password_hash, ...user }) => user);

    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body
    if (!username || !password || !role) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }


    if (password.trim() === '') {
      res.status(400).json({ message: 'La contraseña no puede estar vacía' });
      return;
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userService.createUser({
      username,
      password_hash: hashedPassword,
      role,
    });


    const { password_hash, ...userWithoutPassword } = user;


    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    if (!res.headersSent) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: 'Error al crear usuario', error: errorMessage });
    }
  }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;

   
    let hashedPassword: string | undefined;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const user = await userService.updateUser(Number(req.params.id), {
      username,
      password_hash: hashedPassword,
      role,
    });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

   
    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userExists = await userService.getUserById(Number(req.params.id));
    if (!userExists) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await userService.deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};


// Obtener un usuario por su nombre de usuario (función utilizada para login)
export const getUserByUsername = async (username: string): Promise<any | null> => {
  try {
    const user = await userService.getUserByUsername(username);
    return user;
  } catch (error) {
    console.error('Error al obtener usuario por nombre de usuario:', error);
    return null;
  }
}

