import { Request, Response, NextFunction } from 'express';

export const permit = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};