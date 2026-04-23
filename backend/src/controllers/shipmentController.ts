import { Request, Response, NextFunction } from 'express';
import shipmentService from '../services/shipmentService';
import AppError from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth';

class ShipmentController {
  async createShipment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { senderName, receiverName, originBranchId, destination, description } = req.body;

      const shipment = await shipmentService.createShipment(
        { senderName, receiverName, originBranchId, destination, description },
        req.user!.id,
        req.user!.role,
        req.user!.branch_id
      );

      res.status(201).json({
        success: true,
        message: 'Shipment created successfully',
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getShipments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await shipmentService.getShipments(
        req.user!.role,
        req.user!.branch_id,
        limit,
        offset
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getShipmentById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const shipment = await shipmentService.getShipmentById(
        id,
        req.user!.role,
        req.user!.branch_id
      );

      res.status(200).json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateShipmentStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { shipmentId } = req.params;
      const { status, branchId, description } = req.body;

      if (!status || !branchId) {
        throw new AppError('Status and branchId are required', 400);
      }

      const history = await shipmentService.updateShipmentStatus(
        shipmentId,
        status,
        branchId,
        description,
        req.user!.id,
        req.user!.role,
        req.user!.branch_id
      );

      res.status(200).json({
        success: true,
        message: 'Shipment status updated successfully',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }

  async trackShipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { trackingNumber } = req.params;

      const shipment = await shipmentService.trackShipment(trackingNumber);

      res.status(200).json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ShipmentController();
