import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService.js';
import AppError from '../utils/errorHandler.js';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
