import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

interface Shipment {
  id: string;
  trackingId: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Delayed';
  branch: string;
  lastUpdate: string;
  origin: string;
  destination: string;
}

export const SuperAdminShipments: React.FC = () => {
  const [filter, setFilter] = React.useState('all');
  const [shipments, setShipments] = React.useState<Shipment[]>([
    {
      id: 'SHP001',
      trackingId: 'XF27-001',
      status: 'In Transit',
      branch: 'Dar es Salaam',
      lastUpdate: '2 hours ago',
      origin: 'Dar es Salaam',
      destination: 'Entebbe',
    },
    {
      id: 'SHP002',
      trackingId: 'XF27-002',
      status: 'Delivered',
      branch: 'Entebbe',
      lastUpdate: 'Today',
      origin: 'Entebbe',
      destination: 'Kinshasa',
    },
    {
      id: 'SHP003',
      trackingId: 'XF27-003',
      status: 'Pending',
      branch: 'Kinshasa',
      lastUpdate: '1 hour ago',
      origin: 'Kinshasa',
      destination: 'Dar es Salaam',
    },
    {
      id: 'SHP004',
      trackingId: 'XF27-004',
      status: 'Delayed',
      branch: 'Dar es Salaam',
      lastUpdate: '5 hours ago',
      origin: 'Dar es Salaam',
      destination: 'Entebbe',
    },
  ]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/super/overview' },
    { id: 'shipments', label: 'Shipments', icon: '📦', path: '/admin/super/shipments' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/super/users' },
    { id: 'branches', label: 'Branches', icon: '🏢', path: '/admin/super/branches' },
    { id: 'services', label: 'Services', icon: '🚚', path: '/admin/super/services' },
    { id: 'tracking', label: 'Tracking Control', icon: '📍', path: '/admin/super/tracking' },
    { id: 'reports', label: 'Reports', icon: '📈', path: '/admin/super/reports' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/admin/super/notifications' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/super/settings' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments =
    filter === 'all'
      ? shipments
      : shipments.filter((s) => s.status.toLowerCase().replace(' ', '-') === filter);

  return (
    <DashboardLayout
      title="Global Shipments"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Shipments</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('in-transit')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'in-transit'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('delayed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'delayed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delayed
            </button>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Tracking ID</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Branch</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Route</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Last Update</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">{shipment.trackingId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{shipment.branch}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {shipment.origin} → {shipment.destination}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{shipment.lastUpdate}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium transition">
                      View
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 text-sm font-medium transition">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Shipment CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Create New Shipment</h3>
              <p className="text-blue-100 mt-1">Add a shipment directly to the system</p>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition">
              + Create Shipment
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
