import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[ERROR]', err);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({ message });
}
// This error handler should be used after all routes and middlewares