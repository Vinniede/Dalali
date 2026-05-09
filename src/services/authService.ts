import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import AppError from '../utils/errorHandler.js';
import { ROLES } from '../config/constants.js';

interface LoginResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    branch_id: string | null;
  };
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  branch_id: string | null;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Get user from database
    const result = await pool.query(
      'SELECT id, name, email, password, role, branch_id FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id,
        name: user.name,
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id,
      },
    };
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    role: string,
    branchId: string | null = null
  ): Promise<UserData> {
    // Validate input
    if (!name || !email || !password || !role) {
      throw new AppError('All fields are required', 400);
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, branch_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, branch_id',
      [name, email, hashedPassword, role, branchId]
    );

    return result.rows[0];
  }
}

export default new AuthService();
