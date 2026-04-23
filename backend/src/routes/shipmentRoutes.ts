import { Router, Request, Response, NextFunction } from 'express';
import shipmentController from '../controllers/shipmentController';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Public route - track shipment
router.get('/track/:trackingNumber', (req: Request, res: Response, next: NextFunction) =>
  shipmentController.trackShipment(req, res, next)
);

// Protected routes - admin only
router.post('/', verifyToken, (req: AuthRequest, res: Response, next: NextFunction) =>
  shipmentController.createShipment(req, res, next)
);

router.get('/', verifyToken, (req: AuthRequest, res: Response, next: NextFunction) =>
  shipmentController.getShipments(req, res, next)
);

router.get('/:id', verifyToken, (req: AuthRequest, res: Response, next: NextFunction) =>
  shipmentController.getShipmentById(req, res, next)
);

router.post('/status/:shipmentId', verifyToken, (req: AuthRequest, res: Response, next: NextFunction) =>
  shipmentController.updateShipmentStatus(req, res, next)
);

export default router;
