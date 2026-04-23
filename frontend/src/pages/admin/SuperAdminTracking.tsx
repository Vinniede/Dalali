import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

export const SuperAdminTracking: React.FC = () => {
  const [trackingId, setTrackingId] = React.useState('');
  const [status, setStatus] = React.useState('In Transit');
  const [selectedBranch, setSelectedBranch] = React.useState('');

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

  return (
    <DashboardLayout
      title="Tracking Control System"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {/* Search Shipment */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Search Shipment</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g., XF27-001)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
              Search
            </button>
          </div>
        </div>

        {/* Tracking Timeline Editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Shipment Timeline</h3>
          <div className="space-y-4">
            {['Created', 'In Transit', 'At Branch', 'Out for Delivery', 'Delivered'].map((stage, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                <input
                  type="checkbox"
                  checked={index <= 2}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{stage}</p>
                  <p className="text-sm text-gray-500">{index <= 2 ? 'Completed' : 'Pending'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Status Update */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Update Shipment Status</h3>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Current Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>In Transit</option>
                <option>At Branch</option>
                <option>Out for Delivery</option>
                <option>Delivered</option>
                <option>Failed Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Update Location</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Branch</option>
                <option value="dar">Dar es Salaam</option>
                <option value="entebbe">Entebbe</option>
                <option value="kinshasa">Kinshasa</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
            Update Tracking Status
          </button>
        </div>

        {/* Real-time Tracking Map */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Real-time Tracking Map</h3>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-600 text-lg">🗺️ Interactive Tracking Map</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
