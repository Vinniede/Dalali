import { Request, Response, NextFunction } from 'express';
import branchService from '../services/branchService.js';
import AppError from '../utils/errorHandler.js';

class BranchController {
  async getAllBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await branchService.getAllBranches(limit, offset);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBranchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const branch = await branchService.getBranchById(id);

      res.status(200).json({
        success: true,
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, country, phone } = req.body;

      const branch = await branchService.createBranch(name, country, phone);

      res.status(201).json({
        success: true,
        message: 'Branch created successfully',
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, country, phone } = req.body;

      const branch = await branchService.updateBranch(id, name, country, phone);

      res.status(200).json({
        success: true,
        message: 'Branch updated successfully',
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const branch = await branchService.deleteBranch(id);

      res.status(200).json({
        success: true,
        message: 'Branch deleted successfully',
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BranchController();
