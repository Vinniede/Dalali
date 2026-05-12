import { Router, Request, Response, NextFunction } from 'express';
import branchController from '../controllers/branchController.js';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Get all branches - public
router.get('/', (req: Request, res: Response, next: NextFunction) =>
  branchController.getAllBranches(req, res, next)
);

// Get branch by ID - public
router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  branchController.getBranchById(req, res, next)
);

// Create branch - super admin only
router.post('/', verifyToken, requireRole(ROLES.SUPER_ADMIN), (req: AuthRequest, res: Response, next: NextFunction) =>
  branchController.createBranch(req, res, next)
);

// Update branch - super admin only
router.put('/:id', verifyToken, requireRole(ROLES.SUPER_ADMIN), (req: AuthRequest, res: Response, next: NextFunction) =>
  branchController.updateBranch(req, res, next)
);

// Delete branch - super admin only
router.delete('/:id', verifyToken, requireRole(ROLES.SUPER_ADMIN), (req: AuthRequest, res: Response, next: NextFunction) =>
  branchController.deleteBranch(req, res, next)
);

export default router;
