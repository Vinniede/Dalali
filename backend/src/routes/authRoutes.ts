import { Router, Request, Response, NextFunction } from 'express';
import authController from '../controllers/authController';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next)
);

export default router;
