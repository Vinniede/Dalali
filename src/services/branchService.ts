import pool from '../config/database.js';
import AppError from '../utils/errorHandler.js';

interface BranchData {
  id: string;
  name: string;
  country: string;
  phone: string;
}

interface BranchResult {
  branches: BranchData[];
  total: number;
  limit: number;
  offset: number;
}

class BranchService {
  async getAllBranches(limit: number = 100, offset: number = 0): Promise<BranchResult> {
    const countResult = await pool.query('SELECT COUNT(*) FROM branches');
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
      'SELECT * FROM branches ORDER BY name ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return {
      branches: result.rows,
      total,
      limit,
      offset,
    };
  }

  async getBranchById(branchId: string): Promise<BranchData> {
    const result = await pool.query('SELECT * FROM branches WHERE id = $1', [branchId]);

    if (result.rows.length === 0) {
      throw new AppError('Branch not found', 404);
    }

    return result.rows[0];
  }

  async createBranch(name: string, country: string, phone: string): Promise<BranchData> {
    if (!name || !country || !phone) {
      throw new AppError('All fields are required', 400);
    }

    const result = await pool.query(
      'INSERT INTO branches (name, country, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, country, phone]
    );

    return result.rows[0];
  }
}

export default new BranchService();
