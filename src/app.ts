import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import shipmentRoutes from './routes/shipmentRoutes';
import userRoutes from './routes/userRoutes';
import branchRoutes from './routes/branchRoutes';

dotenv.config();

const app: Express = express();

// Middleware
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : clientUrl;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? vercelUrl : clientUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/branches', branchRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

export default app;
