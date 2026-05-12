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

  async updateBranch(branchId: string, name: string, country: string, phone: string): Promise<BranchData> {
    if (!name || !country || !phone) {
      throw new AppError('All fields are required', 400);
    }

    const result = await pool.query(
      `UPDATE branches
       SET name = $1, country = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [name, country, phone, branchId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Branch not found', 404);
    }

    return result.rows[0];
  }

  async deleteBranch(branchId: string): Promise<BranchData> {
    const usageResult = await pool.query(
      `SELECT
         EXISTS(SELECT 1 FROM shipments WHERE origin_branch_id = $1) AS has_shipments,
         EXISTS(SELECT 1 FROM tracking_history WHERE branch_id = $1) AS has_tracking_history`,
      [branchId]
    );

    const usage = usageResult.rows[0];
    if (usage?.has_shipments || usage?.has_tracking_history) {
      throw new AppError(
        'Cannot delete this branch because it is already linked to shipments or tracking history',
        400
      );
    }

    const result = await pool.query('DELETE FROM branches WHERE id = $1 RETURNING *', [branchId]);

    if (result.rows.length === 0) {
      throw new AppError('Branch not found', 404);
    }

    return result.rows[0];
  }
}

export default new BranchService();
