import pool from '../config/database.js';
import AppError from '../utils/errorHandler.js';
import bcrypt from 'bcryptjs';

interface UserResult {
  users: any[];
  total: number;
  limit: number;
  offset: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  branch_id: string | null;
}

class UserService {
  async getAllUsers(limit: number = 20, offset: number = 0): Promise<UserResult> {
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
      'SELECT id, name, email, role, branch_id, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return {
      users: result.rows,
      total,
      limit,
      offset,
    };
  }

  async deleteUser(userId: string): Promise<UserData> {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email, role, branch_id',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  }

  async updateUser(userId: string, updateData: any): Promise<UserData> {
    const { name, email, role, branchId } = updateData;
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name) {
      fields.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (role) {
      fields.push(`role = $${paramCount++}`);
      values.push(role);
    }
    if (branchId) {
      fields.push(`branch_id = $${paramCount++}`);
      values.push(branchId);
    }

    if (fields.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, role, branch_id`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  }
}

export default new UserService();
