import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/errorHandler';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorHandler = (err: ErrorWithStatusCode, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] Error:`, err);

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
