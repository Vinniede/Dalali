import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import authService from '../services/authService';
import AppError from '../utils/errorHandler';

class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await userService.getAllUsers(limit, offset);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, role, branchId } = req.body;

      const user = await authService.createUser(name, email, password, role, branchId);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await userService.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
