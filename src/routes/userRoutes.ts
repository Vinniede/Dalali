import { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController.js';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// All user routes require super admin role
router.use(verifyToken, requireRole(ROLES.SUPER_ADMIN));

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  userController.getAllUsers(req, res, next)
);

router.post('/', (req: Request, res: Response, next: NextFunction) =>
  userController.createUser(req, res, next)
);

router.put('/:id', (req: Request, res: Response, next: NextFunction) =>
  userController.updateUser(req, res, next)
);

router.delete('/:id', (req: Request, res: Response, next: NextFunction) =>
  userController.deleteUser(req, res, next)
);

export default router;
