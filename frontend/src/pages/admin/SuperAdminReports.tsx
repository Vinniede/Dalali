import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

export const SuperAdminReports: React.FC = () => {
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
      title="Reports & Analytics"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Report Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Branches</option>
              <option>Dar es Salaam</option>
              <option>Entebbe</option>
              <option>Kinshasa</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Delivered</option>
              <option>In Transit</option>
              <option>Delayed</option>
            </select>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipments per Branch</h3>
            <div className="space-y-3">
              {[
                { branch: 'Dar es Salaam', count: 156, width: 80 },
                { branch: 'Entebbe', count: 98, width: 50 },
                { branch: 'Kinshasa', count: 67, width: 35 },
              ].map((item) => (
                <div key={item.branch}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{item.branch}</p>
                    <p className="text-sm font-bold text-gray-900">{item.count}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.width}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Performance</h3>
            <div className="space-y-3">
              {[
                { status: 'On-Time', count: 285, color: 'bg-green-600' },
                { status: 'Delayed', count: 15, color: 'bg-red-600' },
                { status: 'Pending', count: 45, color: 'bg-yellow-600' },
              ].map((item) => (
                <div key={item.status}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{item.status}</p>
                    <p className="text-sm font-bold text-gray-900">{item.count}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.count / 345) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Export Reports</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2">
              📄 Export as PDF
            </button>
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2">
              📊 Export as Excel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
