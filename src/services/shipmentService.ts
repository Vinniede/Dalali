import pool from '../config/database';
import AppError from '../utils/errorHandler';
import generateTrackingNumber from '../utils/generateTrackingNumber';
import { SHIPMENT_STATUS } from '../config/constants';

interface CreateShipmentData {
  senderName: string;
  receiverName: string;
  originBranchId: string;
  destination: string;
  description?: string;
}

interface ShipmentsResult {
  shipments: any[];
  total: number;
  limit: number;
  offset: number;
}

class ShipmentService {
  async createShipment(
    data: CreateShipmentData,
    userId: string,
    userRole: string,
    userBranchId: string | null
  ): Promise<any> {
    const {
      senderName,
      receiverName,
      originBranchId,
      destination,
      description = '',
    } = data;

    // Validate input
    if (!senderName || !receiverName || !originBranchId || !destination) {
      throw new AppError('All required fields must be provided', 400);
    }

    // Branch admin can only create shipments for their own branch
    if (userRole === 'branch_admin' && originBranchId !== userBranchId) {
      throw new AppError('Branch admins can only create shipments for their branch', 403);
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    try {
      // Start transaction
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Create shipment
        const shipmentResult = await client.query(
          `INSERT INTO shipments (tracking_number, sender_name, receiver_name, origin_branch_id, destination, current_status, created_by, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING *`,
          [trackingNumber, senderName, receiverName, originBranchId, destination, SHIPMENT_STATUS.CREATED, userId]
        );

        const shipment = shipmentResult.rows[0];

        // Create initial tracking history
        await client.query(
          `INSERT INTO tracking_history (shipment_id, branch_id, location, status, description, created_by, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [shipment.id, originBranchId, 'Origin Branch', SHIPMENT_STATUS.CREATED, description || 'Shipment created', userId]
        );

        await client.query('COMMIT');
        return shipment;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error: any) {
      throw new AppError('Error creating shipment: ' + error.message, 500);
    }
  }

  async getShipments(
    userRole: string,
    userBranchId: string | null = null,
    limit: number = 20,
    offset: number = 0
  ): Promise<ShipmentsResult> {
    let query = 'SELECT * FROM shipments';
    let countQuery = 'SELECT COUNT(*) FROM shipments';
    const params: any[] = [];

    if (userRole === 'branch_admin') {
      query += ' WHERE origin_branch_id = $1';
      countQuery += ' WHERE origin_branch_id = $1';
      params.push(userBranchId);
    }

    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return {
      shipments: result.rows,
      total,
      limit,
      offset,
    };
  }

  async getShipmentById(
    shipmentId: string,
    userRole: string | null = null,
    userBranchId: string | null = null
  ): Promise<any> {
    const result = await pool.query('SELECT * FROM shipments WHERE id = $1', [shipmentId]);

    if (result.rows.length === 0) {
      throw new AppError('Shipment not found', 404);
    }

    const shipment = result.rows[0];

    // Check branch access
    if (userRole === 'branch_admin' && shipment.origin_branch_id !== userBranchId) {
      throw new AppError('You do not have access to this shipment', 403);
    }

    // Get tracking history
    const historyResult = await pool.query(
      'SELECT * FROM tracking_history WHERE shipment_id = $1 ORDER BY created_at ASC',
      [shipmentId]
    );

    return {
      ...shipment,
      history: historyResult.rows,
    };
  }

  async updateShipmentStatus(
    shipmentId: string,
    status: string,
    branchId: string,
    description: string = '',
    userId: string,
    userRole: string,
    userBranchId: string | null
  ): Promise<any> {
    // Check shipment exists and access
    await this.getShipmentById(shipmentId, userRole, userBranchId);

    // Add tracking history
    const result = await pool.query(
      `INSERT INTO tracking_history (shipment_id, branch_id, location, status, description, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [shipmentId, branchId, '', status, description, userId]
    );

    // Update current status in shipment
    await pool.query(
      'UPDATE shipments SET current_status = $1, updated_at = NOW() WHERE id = $2',
      [status, shipmentId]
    );

    return result.rows[0];
  }

  async trackShipment(trackingNumber: string): Promise<any> {
    const result = await pool.query(
      'SELECT * FROM shipments WHERE tracking_number = $1',
      [trackingNumber]
    );

    if (result.rows.length === 0) {
      throw new AppError('Shipment not found', 404);
    }

    const shipment = result.rows[0];

    // Get tracking history
    const historyResult = await pool.query(
      'SELECT * FROM tracking_history WHERE shipment_id = $1 ORDER BY created_at ASC',
      [shipment.id]
    );

    return {
      ...shipment,
      history: historyResult.rows,
    };
  }
}

export default new ShipmentService();
