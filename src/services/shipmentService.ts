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
  originCountry?: string;
  destination: string;
  cargoDescription?: string;
  weight?: number;
  volume?: number;
  serviceType?: string;
  status?: string;
  trackingNumber?: string; // Allow manual tracking number input
}

interface UpdateShipmentData {
  senderName: string;
  senderPhone?: string;
  senderAddress?: string;
  receiverName: string;
  receiverPhone?: string;
  receiverAddress?: string;
  originCountry?: string;
  destination: string;
  cargoDescription?: string;
  weight?: number;
  volume?: number;
  serviceType?: string;
  status?: string;
  trackingNumber?: string; // Allow manual tracking number edit
}

interface ShipmentsResult {
  shipments: any[];
  total: number;
  limit: number;
  offset: number;
}

class ShipmentService {
  private readonly createAllowedStatuses = [
    SHIPMENT_STATUS.CREATED,
    SHIPMENT_STATUS.IN_TRANSIT,
  ];

  private readonly editAllowedStatuses = [
    SHIPMENT_STATUS.CREATED,
    SHIPMENT_STATUS.IN_TRANSIT,
    SHIPMENT_STATUS.DELIVERED,
    SHIPMENT_STATUS.DELAYED,
  ];

  private normalizeBranchName(value: string | null | undefined): string {
    return (value || '').trim().toLowerCase();
  }

  private validateStatus(
    status: string,
    allowedStatuses: string[],
    action: 'create' | 'edit'
  ): string {
    if (!allowedStatuses.includes(status)) {
      throw new AppError(
        `Invalid shipment status for ${action}. Allowed values: ${allowedStatuses.join(', ')}`,
        400
      );
    }

    return status;
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
    userId: string | null,
    allowDestinationAccess: boolean
  ): Promise<void> {
    if (userRole !== 'branch_admin') {
      return;
    }

    const isCreator = String(shipment.created_by) === String(userId);
    let isDestinationBranch = false;

    if (allowDestinationAccess && userBranchId) {
      const branchName = await this.getBranchName(userBranchId);
      isDestinationBranch =
        this.normalizeBranchName(branchName) === this.normalizeBranchName(shipment.destination);
    }

    if (!isCreator && !isDestinationBranch) {
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
      originCountry,
      destination,
      cargoDescription = '',
      weight,
      volume,
      serviceType = 'Standard',
      status = SHIPMENT_STATUS.CREATED,
      trackingNumber: providedTrackingNumber,
    } = data;

    if (!senderName || !receiverName || !originCountry || !destination) {
      throw new AppError('All required fields must be provided', 400);
    }

    const initialStatus = this.validateStatus(status, this.createAllowedStatuses, 'create');
    
    // Use provided tracking number or generate one
    let trackingNumber = providedTrackingNumber?.trim();
    
    if (trackingNumber) {
      // Check if provided tracking number already exists
      const existingShipment = await pool.query(
        'SELECT id FROM shipments WHERE tracking_number = $1',
        [trackingNumber]
      );
      
      if (existingShipment.rows.length > 0) {
        throw new AppError(`Tracking number "${trackingNumber}" is already in use`, 400);
      }
    } else {
      // Generate tracking number if not provided
      trackingNumber = generateTrackingNumber();
    }

    try {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const shipmentResult = await client.query(
          `INSERT INTO shipments (
            tracking_number, sender_name, sender_phone, sender_address,
            receiver_name, receiver_phone, receiver_address,
            origin_branch_id, origin_country, destination, cargo_description,
            weight, volume, service_type, current_status, created_by, created_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
           RETURNING *`,
          [
            trackingNumber,
            senderName,
            senderPhone,
            senderAddress,
            receiverName,
            receiverPhone,
            receiverAddress,
            null,
            originCountry,
            destination,
            cargoDescription,
            weight || null,
            volume || null,
            serviceType,
            initialStatus,
            userId,
          ]
        );

        const shipment = shipmentResult.rows[0];

        await client.query(
          `INSERT INTO tracking_history (shipment_id, branch_id, location, status, description, created_by, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [
            shipment.id,
            null,
            originCountry,
            initialStatus,
            initialStatus === SHIPMENT_STATUS.IN_TRANSIT
              ? 'Shipment created and marked as In Transit'
              : cargoDescription || 'Shipment created',
            userId,
          ]
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
    userId: string | null = null,
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

      query += ' WHERE created_by = $1 OR LOWER(TRIM(destination)) = LOWER(TRIM($2))';
      countQuery += ' WHERE created_by = $1 OR LOWER(TRIM(destination)) = LOWER(TRIM($2))';
      params.push(userId, branchName);
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
    userBranchId: string | null = null,
    userId: string | null = null
  ): Promise<any> {
    const result = await pool.query('SELECT * FROM shipments WHERE id = $1', [shipmentId]);

    if (result.rows.length === 0) {
      throw new AppError('Shipment not found', 404);
    }

    const shipment = result.rows[0];

    await this.assertShipmentAccess(shipment, userRole, userBranchId, userId, true);

    const historyResult = await pool.query(
      'SELECT * FROM tracking_history WHERE shipment_id = $1 ORDER BY created_at ASC',
      [shipmentId]
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

  async updateShipmentStatus(
    shipmentId: string,
    status: string,
    branchId: string,
    description: string = '',
    userId: string,
    userRole: string,
    userBranchId: string | null
  ): Promise<any> {
    const shipment = await this.getShipmentById(shipmentId, userRole, userBranchId, userId);

    if (userRole === 'branch_admin' && String(branchId) !== String(userBranchId)) {
      throw new AppError('Branch admins can only post updates for their own branch', 403);
    }

    const location = await this.getBranchName(branchId);

    const result = await pool.query(
      `INSERT INTO tracking_history (shipment_id, branch_id, location, status, description, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [shipmentId, branchId, location || shipment.destination, status, description, userId]
    );

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
    userBranchId: string | null,
    userId: string
  ): Promise<any> {
    const shipmentResult = await pool.query('SELECT * FROM shipments WHERE id = $1', [shipmentId]);

    if (shipmentResult.rows.length === 0) {
      throw new AppError('Shipment not found', 404);
    }

    const shipment = shipmentResult.rows[0];
    await this.assertShipmentAccess(shipment, userRole, userBranchId, userId, false);

    const {
      senderName,
      senderPhone = '',
      senderAddress = '',
      receiverName,
      receiverPhone = '',
      receiverAddress = '',
      originCountry,
      destination,
      cargoDescription = '',
      weight,
      volume,
      serviceType = 'Standard',
      status,
      trackingNumber: providedTrackingNumber,
    } = data;

    if (!senderName || !receiverName || !destination) {
      throw new AppError('Sender, receiver, and destination are required', 400);
    }

    const nextStatus = status
      ? this.validateStatus(status, this.editAllowedStatuses, 'edit')
      : shipment.current_status;

    // Handle tracking number updates
    let finalTrackingNumber = shipment.tracking_number;
    
    if (providedTrackingNumber && providedTrackingNumber.trim() !== shipment.tracking_number) {
      const newTrackingNumber = providedTrackingNumber.trim();
      
      // Check if the new tracking number is already in use (excluding current shipment)
      const existingShipment = await pool.query(
        'SELECT id FROM shipments WHERE tracking_number = $1 AND id != $2',
        [newTrackingNumber, shipmentId]
      );
      
      if (existingShipment.rows.length > 0) {
        throw new AppError(`Tracking number "${newTrackingNumber}" is already in use by another shipment`, 400);
      }
      
      finalTrackingNumber = newTrackingNumber;
    }

    const result = await pool.query(
      `UPDATE shipments
       SET tracking_number = $1,
           sender_name = $2,
           sender_phone = $3,
           sender_address = $4,
           receiver_name = $5,
           receiver_phone = $6,
           receiver_address = $7,
           origin_country = $8,
           destination = $9,
           cargo_description = $10,
           weight = $11,
           volume = $12,
           service_type = $13,
           current_status = $14,
           updated_at = NOW()
       WHERE id = $15
       RETURNING *`,
      [
        finalTrackingNumber,
        senderName,
        senderPhone,
        senderAddress,
        receiverName,
        receiverPhone,
        receiverAddress,
        originCountry || null,
        destination,
        cargoDescription,
        weight || null,
        volume || null,
        serviceType,
        nextStatus,
        shipmentId,
      ]
    );

    if (nextStatus !== shipment.current_status) {
      const location =
        (await this.getBranchName(shipment.origin_branch_id)) ||
        shipment.origin_country ||
        shipment.destination;

      await pool.query(
        `INSERT INTO tracking_history (shipment_id, branch_id, location, status, description, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          shipmentId,
          shipment.origin_branch_id || null,
          location,
          nextStatus,
          `Shipment status changed to ${nextStatus} during admin edit`,
          userId,
        ]
      );
    }

    return result.rows[0];
  }

  async deleteShipment(
    shipmentId: string,
    userRole: string,
    userBranchId: string | null,
    userId: string | null
  ): Promise<any> {
    const shipmentResult = await pool.query('SELECT * FROM shipments WHERE id = $1', [shipmentId]);

    if (shipmentResult.rows.length === 0) {
      throw new AppError('Shipment not found', 404);
    }

    const shipment = shipmentResult.rows[0];
    await this.assertShipmentAccess(shipment, userRole, userBranchId, userId, false);

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

    const historyResult = await pool.query(
      'SELECT * FROM tracking_history WHERE shipment_id = $1 ORDER BY created_at ASC',
      [shipment.id]
    );

    const originBranchName = await this.getBranchName(shipment.origin_branch_id);
    const latestHistory = historyResult.rows[historyResult.rows.length - 1] || null;
    const originDisplay = originBranchName || shipment.origin_country || null;

    return {
      ...shipment,
      origin_branch_name: originDisplay,
      latest_update: latestHistory,
      history: historyResult.rows,
    };
  }
}

export default new ShipmentService();
