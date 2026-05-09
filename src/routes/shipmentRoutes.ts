import { Router, Request, Response, NextFunction } from 'express';
import shipmentController from '../controllers/shipmentController.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

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

router.put('/:id', verifyToken, (req: AuthRequest, res: Response, next: NextFunction) =>
  shipmentController.updateShipment(req, res, next)
);

router.delete('/:id', verifyToken, (req: AuthRequest, res: Response, next: NextFunction) =>
  shipmentController.deleteShipment(req, res, next)
);

router.post('/status/:shipmentId', verifyToken, (req: AuthRequest, res: Response, next: NextFunction) =>
  shipmentController.updateShipmentStatus(req, res, next)
);

export default router;
