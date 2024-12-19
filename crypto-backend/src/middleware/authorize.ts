import { Request, Response, NextFunction } from 'express';

export const authorize = (roles: Array<'Admin' | 'User'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
      return;
    }

    next();
  };
};
