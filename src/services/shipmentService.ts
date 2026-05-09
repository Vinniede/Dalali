import pool from '../config/database.js';
import AppError from '../utils/errorHandler.js';
import generateTrackingNumber from '../utils/generateTrackingNumber.js';
import { SHIPMENT_STATUS } from '../config/constants.js';

interface CreateShipmentData {
  senderName: string;
  senderPhone?: string;
  senderAddress?: string;
  receiverName: string;
  receiverPhone?: string;
  receiverAddress?: string;
  originBranchId: string;
  destination: string;
  cargoDescription?: string;
  weight?: number;
  volume?: number;
  serviceType?: string;
}

interface UpdateShipmentData {
  senderName: string;
  senderPhone?: string;
  senderAddress?: string;
  receiverName: string;
  receiverPhone?: string;
  receiverAddress?: string;
  destination: string;
  cargoDescription?: string;
  weight?: number;
  volume?: number;
  serviceType?: string;
}

interface ShipmentsResult {
  shipments: any[];
  total: number;
  limit: number;
  offset: number;
}

class ShipmentService {
  private normalizeBranchName(value: string | null | undefined): string {
    return (value || '').trim().toLowerCase();
  }

  private async getBranchName(branchId: string | number | null): Promise<string | null> {
    if (!branchId) {
      return null;
    }

    const result = await pool.query('SELECT name FROM branches WHERE id = $1', [branchId]);
    return result.rows[0]?.name || null;
  }

  private async assertShipmentAccess(
    shipment: any,
    userRole: string | null,
    userBranchId: string | null,
    allowDestinationAccess: boolean
  ): Promise<void> {
    if (userRole !== 'branch_admin') {
      return;
    }

    if (!userBranchId) {
      throw new AppError('Branch information is required', 403);
    }

    const isOriginBranch = String(shipment.origin_branch_id) === String(userBranchId);
    let isDestinationBranch = false;

    if (allowDestinationAccess) {
      const branchName = await this.getBranchName(userBranchId);
      isDestinationBranch =
        this.normalizeBranchName(branchName) === this.normalizeBranchName(shipment.destination);
    }

    if (!isOriginBranch && !isDestinationBranch) {
      throw new AppError('You do not have access to this shipment', 403);
    }
  }

  async createShipment(
    data: CreateShipmentData,
    userId: string,
    userRole: string,
    userBranchId: string | null
  ): Promise<any> {
    const {
      senderName,
      senderPhone = '',
      senderAddress = '',
      receiverName,
      receiverPhone = '',
      receiverAddress = '',
      originBranchId,
      destination,
      cargoDescription = '',
      weight,
      volume,
      serviceType = 'Standard',
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

        // Create shipment with all fields
        const shipmentResult = await client.query(
          `INSERT INTO shipments (
            tracking_number, sender_name, sender_phone, sender_address, 
            receiver_name, receiver_phone, receiver_address, 
            origin_branch_id, destination, cargo_description, 
            weight, volume, service_type, current_status, created_by, created_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
           RETURNING *`,
          [
            trackingNumber, 
            senderName, 
            senderPhone, 
            senderAddress,
            receiverName, 
            receiverPhone, 
            receiverAddress,
            originBranchId, 
            destination, 
            cargoDescription,
            weight || null,
            volume || null,
            serviceType,
            SHIPMENT_STATUS.CREATED, 
            userId
          ]
        );

        const shipment = shipmentResult.rows[0];

        // Create initial tracking history
        await client.query(
          `INSERT INTO tracking_history (shipment_id, branch_id, location, status, description, created_by, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [shipment.id, originBranchId, 'Origin Branch', SHIPMENT_STATUS.CREATED, cargoDescription || 'Shipment created', userId]
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
      const branchName = await this.getBranchName(userBranchId);

      if (!branchName) {
        throw new AppError('Branch not found for current user', 403);
      }

      query += ' WHERE origin_branch_id = $1 OR LOWER(TRIM(destination)) = LOWER(TRIM($2))';
      countQuery += ' WHERE origin_branch_id = $1 OR LOWER(TRIM(destination)) = LOWER(TRIM($2))';
      params.push(userBranchId, branchName);
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

    await this.assertShipmentAccess(shipment, userRole, userBranchId, true);

    // Get tracking history
    const historyResult = await pool.query(
      'SELECT * FROM tracking_history WHERE shipment_id = $1 ORDER BY created_at ASC',
      [shipmentId]
    );

    const originBranchName = await this.getBranchName(shipment.origin_branch_id);

    return {
      ...shipment,
      origin_branch_name: originBranchName,
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
    const shipment = await this.getShipmentById(shipmentId, userRole, userBranchId);

    if (userRole === 'branch_admin' && String(branchId) !== String(userBranchId)) {
      throw new AppError('Branch admins can only post updates for their own branch', 403);
    }

    const location = await this.getBranchName(branchId);

    // Add tracking history
    const result = await pool.query(
      `INSERT INTO tracking_history (shipment_id, branch_id, location, status, description, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [shipmentId, branchId, location || shipment.destination, status, description, userId]
    );

    // Update current status in shipment
    await pool.query(
      'UPDATE shipments SET current_status = $1, updated_at = NOW() WHERE id = $2',
      [status, shipmentId]
    );

    return result.rows[0];
  }

  async updateShipment(
    shipmentId: string,
    data: UpdateShipmentData,
    userRole: string,
    userBranchId: string | null
  ): Promise<any> {
    const shipmentResult = await pool.query('SELECT * FROM shipments WHERE id = $1', [shipmentId]);

    if (shipmentResult.rows.length === 0) {
      throw new AppError('Shipment not found', 404);
    }

    const shipment = shipmentResult.rows[0];
    await this.assertShipmentAccess(shipment, userRole, userBranchId, false);

    const {
      senderName,
      senderPhone = '',
      senderAddress = '',
      receiverName,
      receiverPhone = '',
      receiverAddress = '',
      destination,
      cargoDescription = '',
      weight,
      volume,
      serviceType = 'Standard',
    } = data;

    if (!senderName || !receiverName || !destination) {
      throw new AppError('Sender, receiver, and destination are required', 400);
    }

    const result = await pool.query(
      `UPDATE shipments
       SET sender_name = $1,
           sender_phone = $2,
           sender_address = $3,
           receiver_name = $4,
           receiver_phone = $5,
           receiver_address = $6,
           destination = $7,
           cargo_description = $8,
           weight = $9,
           volume = $10,
           service_type = $11,
           updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        senderName,
        senderPhone,
        senderAddress,
        receiverName,
        receiverPhone,
        receiverAddress,
        destination,
        cargoDescription,
        weight || null,
        volume || null,
        serviceType,
        shipmentId,
      ]
    );

    return result.rows[0];
  }

  async deleteShipment(
    shipmentId: string,
    userRole: string,
    userBranchId: string | null
  ): Promise<any> {
    const shipmentResult = await pool.query('SELECT * FROM shipments WHERE id = $1', [shipmentId]);

    if (shipmentResult.rows.length === 0) {
      throw new AppError('Shipment not found', 404);
    }

    const shipment = shipmentResult.rows[0];
    await this.assertShipmentAccess(shipment, userRole, userBranchId, false);

    const result = await pool.query(
      'DELETE FROM shipments WHERE id = $1 RETURNING id, tracking_number',
      [shipmentId]
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

    const originBranchName = await this.getBranchName(shipment.origin_branch_id);
    const latestHistory = historyResult.rows[historyResult.rows.length - 1] || null;

    return {
      ...shipment,
      origin_branch_name: originBranchName,
      latest_update: latestHistory,
      history: historyResult.rows,
    };
  }
}

export default new ShipmentService();
