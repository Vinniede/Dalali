import React from 'react';
import shipmentService from '../services/shipmentService';
import { formatDate, getStatusBgColor, getStatusTextColor } from '../services/utils';

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

interface ShipmentsListProps {
  shipments: Shipment[];
  onSelectId?: (id: string) => void;
  loading: boolean;
}

export const ShipmentsList: React.FC<ShipmentsListProps> = ({ shipments, onSelectId, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Shipments</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectId?.(shipment.id)}>
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{shipment.tracking_number}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{shipment.sender_name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{shipment.destination}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full ${getStatusBgColor(shipment.current_status)} ${getStatusTextColor(shipment.current_status)}`}>
                    {shipment.current_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(shipment.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
