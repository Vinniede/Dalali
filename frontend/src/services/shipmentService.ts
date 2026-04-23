import api from './api';

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  origin_branch_id: string;
  destination: string;
  current_status: string;
  created_at: string;
  history?: any[];
}

interface ShipmentsResponse {
  success: boolean;
  data: {
    shipments: Shipment[];
    total: number;
    limit: number;
    offset: number;
  };
}

interface ShipmentResponse {
  success: boolean;
  data: Shipment;
}

class ShipmentService {
  async getShipments(limit: number = 20, offset: number = 0): Promise<ShipmentsResponse> {
    const response = await api.get<ShipmentsResponse>('/shipments', {
      params: { limit, offset },
    });
    return response.data;
  }

  async getShipmentById(id: string): Promise<ShipmentResponse> {
    const response = await api.get<ShipmentResponse>(`/shipments/${id}`);
    return response.data;
  }

  async createShipment(data: any): Promise<ShipmentResponse> {
    const response = await api.post<ShipmentResponse>('/shipments', data);
    return response.data;
  }

  async updateShipmentStatus(shipmentId: string, status: string, branchId: string, description: string): Promise<any> {
    const response = await api.post(`/shipments/status/${shipmentId}`, {
      status,
      branchId,
      description,
    });
    return response.data;
  }

  async trackShipment(trackingNumber: string): Promise<ShipmentResponse> {
    const response = await api.get<ShipmentResponse>(`/shipments/track/${trackingNumber}`);
    return response.data;
  }
}

export default new ShipmentService();
