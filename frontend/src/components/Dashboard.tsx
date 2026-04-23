import React from 'react';
import shipmentService from '../services/shipmentService';
import { formatDate, getStatusBgColor, getStatusTextColor } from '../services/utils';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = React.useState({
    totalShipments: 0,
    inTransit: 0,
    delivered: 0,
    delayed: 0,
  });

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await shipmentService.getShipments(1000);
      const shipments = response.data.shipments;

      const inTransit = shipments.filter((s: any) => s.current_status === 'In Transit').length;
      const delivered = shipments.filter((s: any) => s.current_status === 'Delivered').length;
      const delayed = shipments.filter((s: any) => s.current_status === 'Delayed').length;

      setStats({
        totalShipments: shipments.length,
        inTransit,
        delivered,
        delayed,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{stats.totalShipments}</div>
          <div className="text-gray-600 mt-2">Total Shipments</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-yellow-600">{stats.inTransit}</div>
          <div className="text-gray-600 mt-2">In Transit</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">{stats.delivered}</div>
          <div className="text-gray-600 mt-2">Delivered</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-red-600">{stats.delayed}</div>
          <div className="text-gray-600 mt-2">Delayed</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/shipments"
            className="block p-6 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition text-center"
          >
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold">View Shipments</div>
          </a>
          <a
            href="/admin/shipments"
            className="block p-6 bg-green-50 rounded-lg border-2 border-green-200 hover:border-green-400 transition text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-semibold">Create Shipment</div>
          </a>
          <a
            href="/"
            className="block p-6 bg-purple-50 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">View Analytics</div>
          </a>
        </div>
      </div>
    </div>
  );
};
